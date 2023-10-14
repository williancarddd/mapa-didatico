import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Dados de exemplo
x = np.array([1, 2, 3, 4, 5])
y = np.array([2, 4, 5, 4, 5])

# Função para calcular a regressão linear
def linear_regression(x, y):
    n = len(x)
    m = (n * np.sum(x * y) - np.sum(x) * np.sum(y)) / (n * np.sum(x**2) - (np.sum(x))**2)
    b = (np.sum(y) - m * np.sum(x)) / n
    return m, b

# Função para atualizar o gráfico
def update(frame):
    plt.cla()
    plt.scatter(x, y, label='Pontos de dados')
    m, b = linear_regression(x[:frame], y[:frame])
    y_pred = m * x + b
    plt.plot(x, y_pred, color='red', label='Regressão Linear')
    plt.title(f'Frame {frame}')
    plt.legend()

# Criação da animação
fig, ax = plt.subplots()
animation = FuncAnimation(fig, update, frames=range(1, len(x) + 1), repeat=False)

plt.show()
