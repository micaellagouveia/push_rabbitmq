require('dotenv/config')
const axios = require('axios')

module.exports = {
    getHomologVersion: async (projectId, path) => {
        const params = {
            private_token: process.env.PRIVATE_TOKEN,
            path: `${path}` //esse path eu tenho que pegar pelo path que achar o arquivo sql
        }
        console.log('REPOSITORY *********************')
        console.log(process.env.PRIVATE_TOKEN)
        console.log(path)
        console.log(`${process.env.GITLAB_API}/${projectId}/repository/tree`)

        console.log(`\n\n${process.env.GITLAB_API}/${projectId}/repository/tree?private_token=${process.env.PRIVATE_TOKEN}&path=${path}\n\n`)

        const response = await axios.get(`${process.env.GITLAB_API}/${projectId}/repository/tree?private_token=${process.env.PRIVATE_TOKEN}&path=${path}`)

       // console.log(response.data)
        return response.data
    }
}