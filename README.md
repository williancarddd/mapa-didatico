# Guia de Uso do Mapa Didático

Este guia fornece instruções detalhadas sobre como configurar e usar o Mapa Didático. O Mapa Didático é uma aplicação que combina um backend e um frontend para visualização de dados meteorológicos históricos.

## Configurando o Backend

Siga os passos abaixo para configurar o backend:

1. Acesse a pasta "mapa-didatico-backend".
2. Execute o comando `pip install -r requirements.txt` para instalar as dependências Python necessárias.
3. Certifique-se de que as pastas "/output" e "/years" existem dentro da pasta "process_data".
4. Acesse o site [INMET Dados Históricos](https://portal.inmet.gov.br/dadoshistoricos) e faça o download de pelo menos 3 anos de informações meteorológicas. Recomendamos os anos 2021, 2022 e 2023.
5. Descomprima os dados baixados e coloque-os na pasta "/years". A estrutura da pasta "/years" deve ser como a seguinte:
   
   /years
-- 2021
-- 2022
...



6. Configure o arquivo ".env" com as informações do seu banco de dados, incluindo o nome do banco de dados.
7. Vá para a pasta "db" e execute o arquivo "index.py". Este processo pode demorar algumas horas ou minutos, dependendo da quantidade de dados que você baixou.
8. Após a configuração do banco de dados, vá para a pasta "api" e execute o arquivo "index.py". Isso deve iniciar o seu backend.

## Configurando o Frontend

Siga os passos abaixo para configurar o frontend:

1. Certifique-se de que o Node.js esteja instalado na versão mais recente.
2. Certifique-se de ter o "yarn" instalado, que é o gerenciador de pacotes.
3. Vá para a pasta "mapa-didatico-frontend".
4. Execute o comando `yarn` para instalar as dependências necessárias da aplicação.
5. Execute o comando `yarn dev` para iniciar a aplicação frontend.

Após seguir todas essas etapas, o seu Mapa Didático estará funcionando com o backend e frontend configurados corretamente. Certifique-se de que todas as dependências foram instaladas com sucesso e que os dados meteorológicos foram baixados e processados no backend antes de iniciar o frontend.
