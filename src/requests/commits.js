require('dotenv/config');
const axios = require('axios')

module.exports = {
    // Move arquivo sql para a pasta mais nova de homologação e trata os erros que podem surgir
    moveFile: async (pathFile, sql, id) => {

        var res = ''

        console.log('FUNÇÃO MOVEFILE:  ************')
        console.log('antiga: ' + sql)
        console.log('nova: ' + pathFile)
        console.log('id: ' + id)
        console.log('******************************')

        const erro1 = `{"message":"A file with this name already exists"}`
        const erro2 = `{"message":"A file with this name doesn't exist"}`
        const json =
        {
            "branch": "develop",
            "commit_message": "Atualizando arquivo sql para pasta de homologação",
            "actions": [
                {
                    "action": "move",
                    "file_path": `${pathFile}`,
                    "previous_path": `${sql}`,
                }
            ]
        }

        try {
            const response = await axios.post(`${process.env.GITLAB_API}/${id}/repository/commits?private_token=${process.env.PRIVATE_TOKEN}`, json)
            res = response.data
        } catch (err) {
            res = err.response.data
        }

        if (JSON.stringify(res) === erro2) res = 'Erro: arquivo não existente'

        if (JSON.stringify(res) === erro1) res = 'Erro: arquivo com mesmo nome já existente!'


        return res
    }
}