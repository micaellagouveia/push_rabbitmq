require('dotenv/config');
const axios = require('axios')

module.exports = {
    // Move arquivo sql para a pasta mais nova de homologação
    moveFile: async (pathFile, sql, id) => {

        var res = ''

        console.log('Na função commits: ')
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
        const erro1 = "{ message: 'A file with this name already exists' }"

        try {
            const response = await axios.post(`${process.env.GITLAB_API}/${id}/repository/commits?private_token=${process.env.PRIVATE_TOKEN}`, json)
            res = response.data
        } catch (err) {
            res = err.response.data
        }

        console.log('RES')
        console.log(res)

        return res
    }
}