require('dotenv/config')
const axios = require('axios')
const DOMParser = require('xmldom').DOMParser

module.exports = {

    // Pega a versão que está em homologação (branch develop) -> extrai do arquivo pom.xml
    getHomologVersion: async (projectId) => {

        console.log('entrou')
        console.log(`${process.env.GITLAB_API}/${projectId}/repository/files/pom.xml/raw?ref=develop&private_token=${process.env.PRIVATE_TOKEN}`)

        const response = await axios.get(`${process.env.GITLAB_API}/${projectId}/repository/files/pom.xml/raw?ref=develop&private_token=${process.env.PRIVATE_TOKEN}`)

        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(response.data,'text/xml')
        
        const version = xmlDoc.getElementsByTagName('version')[0].childNodes[0].nodeValue
        const number = version.split('-')

        console.log('number: ' + number[0])

        return number[0]
    },

    // acessa os arquivos da pasta de homologação
    getHomologFile: async (projectId, pathTree) => {

        const params = {
            private_token : `${process.env.PRIVATE_TOKEN}`,
            ref : 'develop',
            path : pathTree
        }
        const response = await axios.get(`${process.env.GITLAB_API}/${projectId}/repository/tree?ref=develop&private_token=${process.env.PRIVATE_TOKEN}&path=${pathTree}`)

        return response.data
    }
}