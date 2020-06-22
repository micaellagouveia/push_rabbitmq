require('dotenv/config')
const axios = require('axios')
const DOMParser = require('xmldom').DOMParser

module.exports = {

    getHomologVersion: async (projectId) => {

        const response = await axios.get(`${process.env.GITLAB_API}/${projectId}/repository/files/pom.xml/raw?ref=develop&private_token=${process.env.PRIVATE_TOKEN}`)

        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(response.data,'text/xml')
        
        const version = xmlDoc.getElementsByTagName('version')[0].childNodes[0].nodeValue
        const number = version.split('-')

        return number[0]
    }
}