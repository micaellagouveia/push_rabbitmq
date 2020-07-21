module.exports = {

    // Checa a existência de arquivo sql nas pastas adicionadas/modificadas no push
    checkSql: (array) => {

        for (let i in array) {
            if (array[i].includes('.sql')) return array[i]
        }
        return ''
    },

    // Pega o path em que o arquivo vai ser movido
    getPathFile: (sql, homologVersion) => {
        const array = sql.split('/')
        let path = ''

        const name = array[array.length - 1]

        const newName = updateName(name, homologVersion)

        for (let i = 0; i < array.length - 2; i++) { // length-2 pois o ultimo é o nome do arquivo, e o penultimo a versao antiga
            path += array[i] + '/'
        }
        return path + homologVersion + '/' + newName
    },

    // Pega a versão que está o arquivo do push
    getFileVersion: (sqlPath) => {

        const fileVersion = sqlPath.split('/')
        const i = fileVersion.length - 2

        return fileVersion[i]
    },

    // Compara versão do arquivo do push com a versão que está em homologação
    compareVersions: (homologVersion, fileVersion) => {
        if (fileVersion === homologVersion) {
            return false
        }
        return true
    }
}

function updateName(name, homologVersion) {

    const array = name.split('_')
    array[1] = homologVersion

    return array.join('_')
}