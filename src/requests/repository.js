require('dotenv/config')
const axios = require('axios')

module.exports = {
    getHomologVersion: async (projectId, path) => {
        const params = {
            private_token: process.env.PRIVATE_TOKEN,
            path: `${path}` //esse path eu tenho que pegar pelo path que achar o arquivo sql
        }

        const response = await axios.get(`${process.env.GITLAB_API}/${projectId}/repository/tree`, params)

        return response.data
    }
}