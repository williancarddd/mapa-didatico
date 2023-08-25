import sqlite3, json
from sqlite3 import Error


def create_database(db_file):
   
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        print(sqlite3.version)
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()




def main():

    # create table for informations:
    """
     {
        "metadata": {
            "REGIAO:": "CO",
            "UF:": "DF",
            "ESTACAO:": "BRASILIA",
            "CODIGO (WMO):": "A001",
            "LATITUDE:": "-15,78944444",
            "LONGITUDE:": "-47,92583332",
            "ALTITUDE:": "1160,96"
        },
        "data": [
            {
                "data": "2022/01/01",
                "hora": "09:00",
                "temp_maxi_h": "17.5"
            },]
    """

    sql_create_table_metricas = """ CREATE TABLE IF NOT EXISTS metricas (
                                        id integer PRIMARY KEY,
                                        id_estacao integer NOT NULL,
                                        data text NOT NULL,
                                        hora text NOT NULL,
                                        temp_maxi_h text NOT NULL
                                    ); """

    sql_create_table_estacao = """ CREATE TABLE IF NOT EXISTS estacao (
                                        id integer PRIMARY KEY,
                                        regiao text NOT NULL,
                                        uf text NOT NULL,
                                        estacao text NOT NULL,
                                        codigo_wmo text NOT NULL,   
                                        latitude text NOT NULL,
                                        longitude text NOT NULL,
                                        altitude text NOT NULL
                                    ); """
    

    try:
        conn = sqlite3.connect(r"2022_metrics_climate.db")
        
        # create tables
        if conn is not None:
            # create metricas table
            cur = conn.cursor()
            cur.execute(sql_create_table_metricas)
            # create estacao table
            cur = conn.cursor()
            cur.execute(sql_create_table_estacao)
        else:
            print("Error! cannot create the database connection.")
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()

    try:
        conn = sqlite3.connect(r"2022_metrics_climate.db")
        
        # create tables
        if conn is not None:
            # insert data in tables
            with open("../process_data/data.json", "r") as f:
                data = json.load(f)
                for i in data:
                    # insert data in estacao table
                    sql = ''' INSERT INTO estacao(regiao,uf,estacao,codigo_wmo,latitude,longitude,altitude)
                              VALUES(?,?,?,?,?,?,?) '''
                    cur = conn.cursor()
                    cur.execute(sql, (i["metadata"]["REGIAO:"],i["metadata"]["UF:"],i["metadata"]["ESTACAO:"],i["metadata"]["CODIGO (WMO):"],i["metadata"]["LATITUDE:"],i["metadata"]["LONGITUDE:"],i["metadata"]["ALTITUDE:"]))
                    conn.commit()
                    # insert data in metricas table
                    for j in i["data"]:
                        sql = ''' INSERT INTO metricas(id_estacao,data,hora,temp_maxi_h)
                                  VALUES(?,?,?,?) '''
                        cur = conn.cursor()
                        cur.execute(sql, (i["metadata"]["CODIGO (WMO):"], j["data"], j["hora"], j["temp_maxi_h"]))
                        conn.commit()
        else:
            print("Error! cannot create the database connection.")
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()

    

if __name__ == '__main__':
    create_database(r"2022_metrics_climate.db")
    main()