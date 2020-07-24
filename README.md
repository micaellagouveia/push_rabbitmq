# Push_rabbitmq

Serviço para rastrear eventos de push (webhooks) de uma exchange do RabbitMQ, identificar mudanças nos arquivos sql da branch develop, checar se essas alterações foram feitas na pasta de homologação.

## Fluxo
### 1. Conexão com o RabbitMQ
* No arquivo receiver.js, a conexão com o RabbitMQ do CNJ é feita, definindo a exchange, queue, e o consumo das mensagens.
* Essa queue recebe os pushs feitos no Gitlab do CNJ.

### 2. Recebimento da Mensagem e Verificação
* A mensagem é recebida e logo é transformada em um objeto Push (definido na pasta models, recebendo os atributos necessários para as operações que serão feitas).
* Uma verificação é feita para que apenas os pushs feitos na branch develop sejam processados.
* Caso o push venha da branch develop, uma verificação é feita para saber se houve mudanças ou adições em arquivos no formato sql. Se houver mudanças, o processo continua.

### 3. Verificação de versão
* Faz-se uma requisição para coletar a versão de homologação. Essa versão se encontra no arquivo pom.xml.
* Uma verificação é feita para saber se as mudanças no arquivo sql foram feitas na atual pasta de homologação.
* Se as versões estiverem diferentes, é necessário passar esse arquivo para a pasta de homologação.

### 4. Definir novo nome do arquivo
* Para esse arquivo modificado, será atribuído um novo nome, contendo o número da versão correta e, como ele vai para a pasta de homologação, seu número de identificação deve mudar também.
* Para isso, é feita uma requisição no repositório para pegar os nomes dos arquivos da pasta de homologação, identificando qual foi o último número de identificação, para poder atribuir o próximo número para o novo arquivo.
* Define-se o path que o arquivo deve ser movido, e pega o path em que ele se encontra. 

### 5. Mudança de Pasta
* Com os paths definidos, faz-se uma requisição do tipo POST para um novo push, em que o arquivo é movido para a pasta de homologação com seu novo nome.