from flask import Flask
from flask_cors import CORS, cross_origin
import mysql.connector, json

db_config = {
    'user': 'root',
    'password': 'Bodepreto20!',
    'host': 'localhost',
    'database': '2022_metrics_database',
    'auth_plugin': 'mysql_native_password'
}

conn = mysql.connector.connect(**db_config)
cursor = conn.cursor(buffered=True)

app = Flask(__name__)
CORS(app, support_credentials=True)


@app.route('/hello/', methods=['GET', 'POST'])
def welcome():
    return "Hello World!"

# get all estacao
@app.route('/estacao/', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_estacao():
    cursor.execute('SELECT id, latitude, longitude, regiao, uf, estacao  FROM estacao;')
    result = cursor.fetchall()
    formatJson = []
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

    return json.dumps(formatJson)

@app.route('/metricas/<int:id_estacao>', methods=['GET'])
def get_metricas(id_estacao):
    cursor.execute("""SELECT id, data, hora, temp_maxi_h FROM metricas WHERE  id_estacao = %s;""", (id_estacao,) )
    result = cursor.fetchall()
    formatJson = []
    for row in result:
        if row[3] == 'NULL' or row[1] == 'NULL' or row[2] == 'NULL':
            continue
        formatJson.append({
            'id': row[0],
            'data': row[1],
            'hora': row[2],
            'temp_maxi_h': row[3],
        })
    return json.dumps(formatJson , default=str)

@app.route('/lagrange/<int:id_estacao>', methods=['GET'])
def  lagrange_step_by_step(id_estacao):
    return str("retornará o passo a passo da formula de lagrange para determinada estacao")

@app.route('/poly/<int:id_estacao>', methods=['GET'])
def  linear_regress_step_by_step(id_estacao):
    return str("retornará o passo a passo da formula de regressão linear para determinada estacao")

# ideias de gerar alguns gráficos

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)