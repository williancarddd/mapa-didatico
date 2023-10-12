import mysql.connector
import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import datetime
import calendar
import numpy as np
from sklearn.preprocessing import PolynomialFeatures
import matplotlib.pyplot as plt
import imageio
import os

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
        # regressão polinomial de grau 2 (parábola)
        poly = PolynomialFeatures(degree=2)
        X_poly = poly.fit_transform(self.X)

        self.model = LinearRegression()
        self.model.fit(X_poly, self.y)

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
        return [intercepto, coeficientes[0], coeficientes[1], coeficientes[2] ]
        #return formula
    
    def prever_temperaturas_ano_meses(self, ano):
        previsoes = []
        for mes in range(1, 13):
            ultimo_dia_do_mes = calendar.monthrange(ano, mes)[1]
            for dia in range(1, ultimo_dia_do_mes + 1):
                data_predicao = datetime(ano, mes, dia)
                dia_predicao = data_predicao.day
                mes_predicao = data_predicao.month
                ano_predicao = data_predicao.year
            
                poly = PolynomialFeatures(degree=2)
                X_poly_pred = poly.fit_transform(np.array([[dia_predicao, mes_predicao, ano_predicao]]))
                temperatura_predita = self.model.predict(X_poly_pred)
                previsoes.append({
                    'dia': dia,
                    'mes': mes,
                    'ano': ano,
                    'media_temp': temperatura_predita[0]
                })
        formula = self.obter_formula()
        return (previsoes, formula)
    
    def create_monthly_regression_gif(self, ano, mes, output_filename):
        # Collect data for the specified year and month
        data = self.load_monthly_data(ano, mes)

        if data is None or data.empty:
            print(f"No data available for Year: {ano}, Month: {mes}")
            return

        # Sort data by day
        data = data.sort_values(by='dia')

        # Initialize lists to store images and regression lines
        images = []
        regression_lines = []

        for _, data_point in data.iterrows():
            dia = data_point['dia']
            previsao = data_point['media_temp']

            # Append the data point to the regression line
            regression_lines.append((dia, previsao))

            # Create a scatter plot of the collected data points
            plt.scatter([d[0] for d in regression_lines], [d[1] for d in regression_lines], c='b', label='Data Points')

            # Fit a regression line on the current data points
            if len(regression_lines) > 1:
                X = np.array([d[:1] for d in regression_lines])
                y = np.array([d[1] for d in regression_lines])
                model = LinearRegression()
                model.fit(X, y)

                # Predict values for the current data points
                predicted = model.predict(X)

                # Plot the regression line
                plt.plot([d[0] for d in regression_lines], predicted, c='r', label='Regression Line')

                # Append the plot to the list of images
                plt.title(f'Regression for Year: {ano}, Month: {mes}, Day: {dia}')
                plt.legend()
                plt.grid()
                image_filename = f'temp_regression_{ano}_{mes}_{dia}.png'
                plt.savefig(image_filename)
                images.append(image_filename)
                plt.clf()

        if not images:
            print("No images generated for the specified month.")
            return

        # Create the GIF from the images
        with imageio.get_writer(output_filename, mode='I') as writer:
            for image in images:
                writer.append_data(imageio.imread(image))
                os.remove(image)  # Remove the saved images after adding to the GIF
            else:
                return 
        

    def load_monthly_data(self, ano, mes):
        conn = mysql.connector.connect(**self.db_params)
        sql_query = """
            SELECT 
                DAY(data) AS dia,
                AVG(temp_maxi_h) AS media_temp
            FROM metricas
            WHERE id_estacao = %s
            AND YEAR(data) = %s
            AND MONTH(data) = %s
            GROUP BY dia;
        """
        data = pd.read_sql_query(sql_query, conn, params=(self.id_estacao, ano, mes))
        conn.close()
        return data
    