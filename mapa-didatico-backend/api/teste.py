import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from matplotlib.animation import FuncAnimation

# Gerar dados de exemplo (substitua isso pelos seus próprios dados)
np.random.seed(0)
X = 2 * np.random.rand(100, 1)
y = 4 + 3 * X + np.random.randn(100, 1)

# Inicialize o modelo de regressão linear
model = LinearRegression()

# Crie uma lista de valores para representar o progresso da linha de regressão
progressive_coef = []

# Defina o número de passos para a animação
num_steps = 100

# Ajuste o modelo e armazene os coeficientes progressivos
for step in range(num_steps):
    model.fit(X[:step+1], y[:step+1])
    progressive_coef.append((model.coef_[0][0], model.intercept_[0]))

# Preparação da figura e dos eixos
fig, ax = plt.subplots()
ax.scatter(X, y)
line, = ax.plot(X, progressive_coef[0][0] * X + progressive_coef[0][1], 'r')

# Defina limites para os eixos x e y
ax.set_xlim(0, 2)
ax.set_ylim(0, 15)

# Adicione título e rótulos dos eixos
ax.set_title('Ajuste de Regressão Linear Animado')
ax.set_xlabel('X')
ax.set_ylabel('y')

# Adicione um texto para mostrar os coeficientes
coef_text = ax.text(0.05, 13, '', fontsize=12)

# Função de atualização para animação
def update_line(num, line, progressive_coef, coef_text):
    line.set_ydata(progressive_coef[num][0] * X + progressive_coef[num][1])
    
    # Limpe as linhas de distância anteriores
    ax.lines.pop()
    
    # Atualize o texto com os coeficientes
    coef_text.set_text(f'Coef: {progressive_coef[num][0]:.2f}, Intercept: {progressive_coef[num][1]:.2f}')
    
    # Adicione as retas das distâncias entre os pontos e a linha de regressão
    distances = y[:num+1] - (progressive_coef[num][0] * X + progressive_coef[num][1])
    ax.vlines(X[:num+1], ymin=y[:num+1], ymax=progressive_coef[num][0] * X[:num+1] + progressive_coef[num][1], colors='g', linestyles='dotted')
    
    return line, coef_text

# Crie a animação
ani = FuncAnimation(fig, update_line, frames=num_steps, fargs=(line, progressive_coef, coef_text), blit=True, interval=100)

# Exiba a animação
plt.show()
