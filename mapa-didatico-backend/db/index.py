import json
import mysql.connector

# Carregar dados do arquivo JSON
with open('../process_data/data.json', 'r') as json_file:
    data = json.load(json_file)

# Configurações do banco de dados
db_config = {
    'user': 'root',
    'password': 'Bodepreto20!',
    'host': 'localhost',
    'database': '2022_metrics_database'
}

# Função para inserir dados na tabela "estacao"
def insert_estacao(cursor, estacao_data):
    insert_estacao_query = """ INSERT INTO estacao (regiao, uf, estacao, codigo_wmo, latitude, longitude, altitude)
                               VALUES (%s, %s, %s, %s, %s, %s, %s); """
    cursor.execute(insert_estacao_query, (estacao_data['REGIAO:'], estacao_data['UF:'], estacao_data['ESTACAO:'],
                                          estacao_data['CODIGO (WMO):'], estacao_data['LATITUDE:'],
                                          estacao_data['LONGITUDE:'], estacao_data['ALTITUDE:']))

# Função para inserir dados na tabela "metricas"
def insert_metricas(cursor, id_estacao, metricas_data):
    metricas_data['data'] = metricas_data['data'].replace('/', '-')
    insert_metricas_query = """ INSERT INTO metricas (id_estacao, data, hora, temp_maxi_h)
                               VALUES (%s, %s, %s, %s); """
    # temp is float or ''
    temp = metricas_data['temp_maxi_h'] if metricas_data['temp_maxi_h'] != '' else None
    cursor.execute(insert_metricas_query, (id_estacao, metricas_data['data'], metricas_data['hora'], temp))

# Conectar ao banco de dados MySQL
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

# Definir queries para criação de tabelas
sql_create_table_metricas = """ CREATE TABLE IF NOT EXISTS metricas (
                                id int AUTO_INCREMENT PRIMARY KEY,
                                id_estacao int NOT NULL,
                                data date NOT NULL,
                                hora time NOT NULL,
                                temp_maxi_h float
                            ); """

sql_create_table_estacao = """ CREATE TABLE IF NOT EXISTS estacao (
                                id int AUTO_INCREMENT PRIMARY KEY,
                                regiao varchar(2) NOT NULL,
                                uf varchar(2) NOT NULL,
                                estacao varchar(50) NOT NULL,
                                codigo_wmo varchar(10) NOT NULL,   
                                latitude varchar(20) NOT NULL,
                                longitude varchar(20) NOT NULL,
                                altitude varchar(20) NOT NULL
                            ); """

# Executar queries de criação de tabelas
cursor.execute(sql_create_table_metricas)
cursor.execute(sql_create_table_estacao)
conn.commit()

# Processar e inserir dados do JSON
for item in data:
    insert_estacao(cursor, item['metadata'])
    id_estacao = cursor.lastrowid
    for metricas in item['data']:
        insert_metricas(cursor, id_estacao, metricas)
    conn.commit()

# Fechar conexão com o banco de dados
cursor.close()
conn.close()
   
