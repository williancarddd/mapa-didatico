from flask import Flask
from flask_cors import CORS, cross_origin
import mysql.connector
import json

app = Flask(__name__)
CORS(app, support_credentials=True)

db_config = {
    'user': 'root',
    'password': 'Bodepreto20!',
    'host': 'localhost',
    'database': '2022_metrics_database',
    'auth_plugin': 'mysql_native_password'
}

def get_database_connection():
    return mysql.connector.connect(**db_config)

@app.route('/hello/', methods=['GET', 'POST'])
def welcome():
    return "Hello World!"

# get all estacao
@app.route('/estacao/', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_estacao():
    formatJson = []
    conn = get_database_connection()
    cursor = conn.cursor(buffered=True)
    cursor.execute('SELECT id, latitude, longitude, regiao, uf, estacao FROM estacao;')
    result = cursor.fetchall()
    for row in result:
        if row[1] == 'NULL' or row[2] == 'NULL':
            continue
        formatJson.append({
            'id': row[0],
            'latitude': row[1],
            'longitude': row[2],
            'regiao': row[3],
            'uf': row[4],
            'estacao': row[5]
        })
    cursor.close()
    conn.close()
    return json.dumps(formatJson)

@app.route('/metricas/<int:id_estacao>', methods=['GET'])
def get_metricas(id_estacao):
    formatJson = []
    conn = get_database_connection()
    cursor = conn.cursor(buffered=True)
    cursor.execute("""SELECT id, data, hora, temp_maxi_h FROM metricas WHERE  id_estacao = %s;""", (id_estacao,) )
    result = cursor.fetchall()
    for row in result:
        if row[3] == 'NULL' or row[1] == 'NULL' or row[2] == 'NULL':
            continue
        formatJson.append({
            'id': row[0],
            'data': row[1],
            'hora': row[2],
            'temp_maxi_h': row[3],
        })
    cursor.close()
    conn.close()
    return json.dumps(formatJson , default=str)


@app.route('/metricas/filter-average-year/<int:id_estacao>', methods=['GET'])
def get_average_year(id_estacao):
    conn = get_database_connection()
    cursor = conn.cursor(buffered=True)
    cursor.execute("""SELECT 
        EXTRACT(DAY FROM data) AS dia,
        EXTRACT(MONTH FROM data) AS mes,
        EXTRACT(YEAR FROM data) AS ano,
        AVG(temp_maxi_h) AS media_temp
        FROM metricas
        WHERE id_estacao = %s
        GROUP BY ano, mes, dia;""", (id_estacao,) )
    result = cursor.fetchall()
    mapped_result = [{'dia': row[0], 'mes': row[1], 'ano': row[2], 'media_temp': row[3]} for row in result]
    cursor.close()
    conn.close()
    return json.dumps(mapped_result, default=str)

@app.route('/metricas/filter-average-month/<int:id_estacao>/<int:month>', methods=['GET'])
def get_average_month(id_estacao, month):
    conn = get_database_connection()
    cursor = conn.cursor(buffered=True)
    cursor.execute("""SELECT 
        EXTRACT(DAY FROM data) AS dia,
        EXTRACT(MONTH FROM data) AS mes,
        EXTRACT(YEAR FROM data) AS ano,
        AVG(temp_maxi_h) AS media_temp
        FROM metricas
        WHERE id_estacao = %s AND EXTRACT(MONTH FROM data) = %s
        GROUP BY ano, mes, dia;""", (id_estacao, month))
    result = cursor.fetchall()
    mapped_result = [{'dia': row[0], 'mes': row[1], 'ano': row[2], 'media_temp': row[3]} for row in result]
    cursor.close()
    conn.close()
    return json.dumps(mapped_result, default=str)

@app.route('/metrics/filter-x-y-z/<int:id_estacao>', methods=['GET'] )
def get_x_y_z(id_estacao):
    formatJson = []
    conn = get_database_connection()
    cursor = conn.cursor(buffered=True)
    cursor.execute("""
     SELECT 
        EXTRACT(DAY FROM data) AS dia,
        EXTRACT(MONTH FROM data) AS mes,
        EXTRACT(YEAR FROM data) AS ano,
        MIN(temp_maxi_h) AS temp_minima,
        MAX(temp_maxi_h) AS temp_maxima
        FROM metricas
        WHERE id_estacao = %s
        GROUP BY ano, mes, dia;
    """, (id_estacao,) )
    result = cursor.fetchall()
    mapped_result = [{'dia': row[0], 'mes': row[1], 'ano': row[2], 'temp_minima': row[3], 'temp_maxima': row[4]} for row in result]
    cursor.close()
    conn.close()
    return json.dumps(mapped_result, default=str)

@app.route('/lagrange/<int:id_estacao>', methods=['GET'])
def  lagrange_step_by_step(id_estacao):
    return str("retornará o passo a passo da fórmula de Lagrange para determinada estação")


@app.route('/poly/<int:id_estacao>', methods=['GET'])
def  linear_regress_step_by_step(id_estacao):
    return str("retornará o passo a passo da fórmula de regressão linear para determinada estação")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)
