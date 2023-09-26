import json
import os
import mysql.connector


class DatabaseManager:
    def __init__(self, db_config):
        self.conn = mysql.connector.connect(**db_config)
        self.cursor = self.conn.cursor()

    def create_tables(self):
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
                                        altitude varchar(20) NOT NULL,
                                        UNIQUE KEY (codigo_wmo)
                                    ); """

        self.cursor.execute(sql_create_table_estacao)
        self.cursor.execute(sql_create_table_metricas)
        self.conn.commit()

    def commit(self):
        self.conn.commit()

    def close(self):
        self.cursor.close()
        self.conn.close()
    

class DataProcessor:
    def __init__(self, db_manager):
        self.db_manager = db_manager

    def process_data_directory(self, data_directory):
        total_files = len([filename for filename in os.listdir(data_directory) if filename.endswith('.json')])
        processed_files = 0

        for filename in os.listdir(data_directory):
            if filename.endswith('.json'):
                file_path = os.path.join(data_directory, filename)
                with open(file_path, 'r') as json_file:
                    data = json.load(json_file)
                    for entry in data:
                        metadata = entry['metadata']
                        data_info = entry['data']  

                        idByStation = self._insert_or_update_station(metadata)
                        metric_data_list = []

                        for metric in data_info:
                            metric_data_list.append(metric)
                        
                        # Use the bulk insertion method
                        self.insert_bulk_metric_data(idByStation, metric_data_list)

                    processed_files += 1
                    progress = (processed_files / total_files) * 100
                    print(f"Progress: {progress:.2f}%")


    def _insert_or_update_station(self, metadata):
        # Check if the station already exists in the database
        query_select = "SELECT id FROM estacao WHERE codigo_wmo = %s"
        self.db_manager.cursor.execute(query_select, (metadata['CODIGO (WMO):'],))
        station_id = self.db_manager.cursor.fetchone()

        if station_id:
            # Station exists, return its ID
            return station_id[0]
        else:
            # Station doesn't exist, so insert it
            query_insert = """INSERT INTO estacao (regiao, uf, estacao, codigo_wmo, latitude, longitude, altitude)
                           VALUES (%s, %s, %s, %s, %s, %s, %s)"""
            values = (metadata['REGIAO:'], metadata['UF:'], metadata['ESTACAO:'],
                      metadata['CODIGO (WMO):'], metadata['LATITUDE:'],
                      metadata['LONGITUDE:'], metadata['ALTITUDE:'])
            self.db_manager.cursor.execute(query_insert, values)
            self.db_manager.conn.commit()

            # Return the last inserted ID
            return self.db_manager.cursor.lastrowid
        
    def _insert_metric_data(self, station_id, data_info):
        # very low
        query = """INSERT INTO metricas (id_estacao, data, hora, temp_maxi_h)
                VALUES (%s, %s, %s, %s)"""
        values = (station_id, data_info["data"], data_info["hora"], data_info["temp_maxi_h"])
        self.db_manager.cursor.execute(query, values)
        self.db_manager.conn.commit()
    
    def insert_bulk_metric_data(self, station_id, data_info_list):
        query = """INSERT INTO metricas (id_estacao, data, hora, temp_maxi_h)
                VALUES (%s, %s, %s, %s)"""
        
        # Convert data_info_list into a list of tuples
        values = [(station_id, data_info["data"], data_info["hora"], data_info["temp_maxi_h"]) for data_info in data_info_list]

        # Use executemany to insert multiple rows in a single query
        self.db_manager.cursor.executemany(query, values)


if __name__ == "__main__":
    db_config = {
        "user": "root",
        "password": "Bodepreto20!",
        "host": "localhost",
        "database": "metrics_database",
        "auth_plugin": "mysql_native_password",
    }

    db_manager = DatabaseManager(db_config)
    data_processor = DataProcessor(db_manager)

    print("Criando Tabelas ...")
    db_manager.create_tables()

    print("Insirindo os Dados ...")
    data_directory = "../process_data/output"
    data_processor.process_data_directory(data_directory)

    db_manager.close()
