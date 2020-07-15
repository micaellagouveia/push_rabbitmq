require('dotenv/config');
const axios = require('axios')

module.exports = {
    // Move arquivo sql para a pasta mais nova de homologação
    moveFile: async (pathFile, sql, id) => {

        console.log('pathfile: ' + pathFile)
        console.log('sql: ' + sql)
        console.log('id: ' + id)
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

        const response = await axios({
            method: 'POST', url: `${process.env.GITLAB_API}/${id}/repository/commits?private_token=${process.env.PRIVATE_TOKEN}`,
            data: { boody: json }
        })

        return response.data
    }
}