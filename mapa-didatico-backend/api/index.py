from flask import Flask, Response
from flask_cors import CORS, cross_origin
import imageio
import mysql.connector
import json
import os

from linear_res import PrevisaoTemperatura

from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

database_name = os.environ.get("DATABASE_NAME")
database_user = os.environ.get("DATABASE_USER")
database_host = os.environ.get("DATABASE_HOST")
secret_key = os.environ.get("SECRET_KEY")


app = Flask(__name__)
CORS(app, support_credentials=True)

db_config = {
        "user": database_user,
        "password": secret_key,
        "host": database_host,
        "database": database_name,
        "auth_plugin": "mysql_native_password"
}


def get_database_connection():
    return mysql.connector.connect(**db_config)


@app.route("/hello/", methods=["GET", "POST"])
def welcome():
    return "Hello World!"


# get all estacao
@app.route("/estacao/", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_estacao():
    formatJson = []
    conn = get_database_connection()
    cursor = conn.cursor(buffered=True)
    cursor.execute("SELECT id, latitude, longitude, regiao, uf, estacao FROM estacao;")
    result = cursor.fetchall()
    for row in result:
        if row[1] == "NULL" or row[2] == "NULL":
            continue
        formatJson.append(
            {
                "id": row[0],
                "latitude": row[1],
                "longitude": row[2],
                "regiao": row[3],
                "uf": row[4],
                "estacao": row[5],
            }
        )
    cursor.close()
    conn.close()
    return json.dumps(formatJson)


@app.route("/metricas/<int:id_estacao>/<int:ano>", methods=["GET"])
def get_metricas(id_estacao, ano):
    formatJson = []
    conn = get_database_connection()
    cursor = conn.cursor(buffered=True)
    cursor.execute(
        """SELECT id, data, hora, temp_maxi_h  
           FROM metricas 
           WHERE id_estacao = %s AND EXTRACT(YEAR FROM data) = %s;""",
        (id_estacao, ano),
    )
    result = cursor.fetchall()
    for row in result:
        if row[3] == "NULL" or row[1] == "NULL" or row[2] == "NULL":
            continue
        formatJson.append(
            {
                "id": row[0],
                "data": row[1],
                "hora": row[2],
                "temp_maxi_h": row[3],
            }
        )
    cursor.close()
    conn.close()
    return json.dumps(formatJson, default=str)


@app.route("/metricas/filter-average-year/<int:id_estacao>/<int:ano>", methods=["GET"])
def get_average_year(id_estacao, ano):
    conn = get_database_connection()
    cursor = conn.cursor(buffered=True)
    cursor.execute(
        """SELECT EXTRACT(DAY FROM data) AS dia,
                  EXTRACT(MONTH FROM data) AS mes,
                  EXTRACT(YEAR FROM data) AS ano,
                  AVG(temp_maxi_h) AS media_temp
           FROM metricas
           WHERE id_estacao = %s AND EXTRACT(YEAR FROM data) = %s
           GROUP BY ano, mes, dia;""",
        (id_estacao, ano),
    )
    result = cursor.fetchall()
    mapped_result = [
        {"dia": row[0], "mes": row[1], "ano": row[2], "media_temp": row[3]}
        for row in result
    ]
    cursor.close()
    conn.close()
    return json.dumps(mapped_result, default=str)


@app.route(
    "/metricas/filter-average-month/<int:id_estacao>/<int:ano>/<int:month>",
    methods=["GET"],
)
def get_average_month(id_estacao, ano, month):
    conn = get_database_connection()
    cursor = conn.cursor(buffered=True)
    cursor.execute(
        """SELECT EXTRACT(DAY FROM data) AS dia,
                  EXTRACT(MONTH FROM data) AS mes,
                  EXTRACT(YEAR FROM data) AS ano,
                  AVG(temp_maxi_h) AS media_temp
           FROM metricas
           WHERE id_estacao = %s AND EXTRACT(YEAR FROM data) = %s AND EXTRACT(MONTH FROM data) = %s
           GROUP BY ano, mes, dia;""",
        (id_estacao, ano, month),
    )
    result = cursor.fetchall()
    mapped_result = [
        {"dia": row[0], "mes": row[1], "ano": row[2], "media_temp": row[3]}
        for row in result
    ]
    cursor.close()
    conn.close()
    return json.dumps(mapped_result, default=str)


@app.route("/metrics/filter-x-y-z/<int:id_estacao>/<int:ano>", methods=["GET"])
def get_x_y_z(id_estacao, ano):
    conn = get_database_connection()
    cursor = conn.cursor(buffered=True)
    cursor.execute(
        """SELECT EXTRACT(DAY FROM data) AS dia,
                  EXTRACT(MONTH FROM data) AS mes,
                  EXTRACT(YEAR FROM data) AS ano,
                  MIN(temp_maxi_h) AS temp_minima,
                  MAX(temp_maxi_h) AS temp_maxima
           FROM metricas
           WHERE id_estacao = %s AND EXTRACT(YEAR FROM data) = %s
           GROUP BY ano, mes, dia;""",
        (id_estacao, ano),
    )
    result = cursor.fetchall()
    mapped_result = [
        {
            "dia": row[0],
            "mes": row[1],
            "ano": row[2],
            "temp_minima": row[3],
            "temp_maxima": row[4],
        }
        for row in result
    ]
    cursor.close()
    conn.close()
    return json.dumps(mapped_result, default=str)


@app.route("/linear/<int:id_estacao>/<int:ano>", methods=["GET"])
def linear_regress_step_by_step(id_estacao, ano):
    previsao = PrevisaoTemperatura(
        db_config["host"],
        db_config["database"],
        db_config["user"],
        db_config["password"],
        id_estacao,
    )
    ano_desejado = ano
    previsoes_ano_meses = previsao.prever_temperaturas_ano_meses(ano_desejado)
    mapped_result = [
        {
            "dia": row["dia"],
            "mes": row["mes"],
            "ano": row["ano"],
            "media_temp": row["media_temp"],
        }
        for row in previsoes_ano_meses[0]
    ]
    return json.dumps(
        {"mapeado": mapped_result, "formula": previsoes_ano_meses[1]}, default=str
    )

@app.route("/linear-gif/<int:id_estacao>/<int:ano>/<int:mes>", methods=["GET"])
def linear_regress_gif(id_estacao, ano, mes):
    previsao = PrevisaoTemperatura(
        db_config["host"],
        db_config["database"],
        db_config["user"],
        db_config["password"],
        id_estacao,
    )
    previsao.create_monthly_regression_gif(ano=ano, mes=mes, output_filename='gif.gif')
    gif_bytes = None
    with open('gif.gif', "rb") as gif_file:
        gif_bytes = gif_file.read()

    # Create a Flask response with the GIF as an attachment
    response = Response(gif_bytes, content_type="image/gif")
    response.headers["Content-Disposition"] = f"attachment; filename=gif.gif"

    os.remove('gif.gif')

    return response
  

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001, debug=True)
