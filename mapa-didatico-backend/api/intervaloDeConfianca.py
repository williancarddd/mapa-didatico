import numpy as np
import scipy.stats as stats

def calcular_intervalo_confianca(amostra, nivel_confianca=0.95):
    """
    Calcula o intervalo de confiança para a média da população.

    Args:
        amostra (array-like): A amostra de dados.
        nivel_confianca (float, optional): O nível de confiança desejado. O padrão é 0.95.

    Returns:
        tuple: Um tuplo contendo o limite inferior e o limite superior do intervalo de confiança.
    """
    media_amostra = np.mean(amostra)
    desvio_padrao_amostra = np.std(amostra, ddof=1)
    erro_padrao = stats.sem(amostra)
    graus_liberdade = len(amostra) - 1
    valor_critico = stats.t.ppf((1 + nivel_confianca) / 2, graus_liberdade)
    margem_erro = valor_critico * erro_padrao
    intervalo_confianca = (media_amostra - margem_erro, media_amostra + margem_erro)
    return intervalo_confianca



