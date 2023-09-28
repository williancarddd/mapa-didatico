import mysql.connector
import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import datetime
import calendar

class PrevisaoTemperatura:
    def __init__(self, host, database, user, password, id_estacao):
        self.db_params = {
            'host': host,
            'database': database,
            'user': user,
            'password': password,
            'auth_plugin': 'mysql_native_password'
        }
        self.id_estacao = id_estacao
        self.model = None
        self.load_data()
        self.train_model()

    def load_data(self):
        conn = mysql.connector.connect(**self.db_params)
        sql_query = """
            SELECT 
                DAY(data) AS dia,
                MONTH(data) AS mes,
                YEAR(data) AS ano,
                AVG(temp_maxi_h) AS media_temp
            FROM metricas
            WHERE id_estacao = %s
            GROUP BY ano, mes, dia;
        """
        data = pd.read_sql_query(sql_query, conn, params=(self.id_estacao,))
        conn.close()

        data['data'] = data.apply(lambda row: datetime(int(row['ano']), int(row['mes']), int(row['dia'])), axis=1)
        data = data.sort_values(by='data')
        self.X = data[['dia', 'mes', 'ano']].values
        self.y = data['media_temp'].values

    def train_model(self):
        self.model = LinearRegression()
        self.model.fit(self.X, self.y)

    def prever_temperatura(self, dia, mes, ano):
        data_predicao = datetime(ano, mes, dia)
        dia_predicao = data_predicao.day
        mes_predicao = data_predicao.month
        ano_predicao = data_predicao.year
        temperatura_predita = self.model.predict([[dia_predicao, mes_predicao, ano_predicao]])
        return temperatura_predita[0]
    
    def obter_formula(self):
        intercepto = self.model.intercept_
        coeficientes = self.model.coef_
        #print(coeficientes)
        #formula = f"Temperatura = {intercepto} + {coeficientes[0]} * dia + {coeficientes[1]} * mes + {coeficientes[2]} * ano"
        return [intercepto, coeficientes[0], coeficientes[1], coeficientes[2] ]
        #return formula
    
    def prever_temperaturas_ano_meses(self, ano):
        previsoes = []
        for mes in range(1, 13):
            ultimo_dia_do_mes = calendar.monthrange(ano, mes)[1]
            for dia in range(1, ultimo_dia_do_mes + 1):
                temperatura_predita = self.prever_temperatura(dia, mes, ano)
                previsoes.append({
                    'dia': dia,
                    'mes': mes,
                    'ano': ano,
                    'media_temp': temperatura_predita
                })
        formula = self.obter_formula()
        return (previsoes, formula)
    
