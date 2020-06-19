require('dotenv/config')
const axios = require('axios')
const DOMParser = require('xmldom').DOMParser

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
    },

    getPomFile: async (projectId) => {
        const params = {
            private_token: process.env.PRIVATE_TOKEN,
            ref: 'develop' 
        }

        console.log('Entrou aqui')

        console.log(params)
        console.log(`${process.env.GITLAB_API}/${projectId}/repository/files/pom.xml/raw`)

        const response = await axios.get(`https://git.cnj.jus.br/api/v4/projects/7/repository/files/pom.xml/raw?private_token=WqANVphpAfk8E3u1h4Qn&ref=develop`)

        console.log('+++++++POM++++++++++')
        //console.log(response.data)

        const parser = new DOMParser()

        const xmlDoc = parser.parseFromString(response.data,'text/xml')
        
        const json = JSON.parse(xmlDoc.toString())

        console.log(json)
        


        return response.data
    }
}