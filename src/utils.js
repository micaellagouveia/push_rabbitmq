module.exports = {

    // Checa a existência de arquivo sql nas pastas adicionadas/modificadas no push
    checkSql: (array) => {

        for (let i in array) {
            if (array[i].includes('.sql')) return array[i]
        }
        return ''
    },

    // Pega o path em que foi feita a mudança do arquivo sql
    getPath: (sql) => {
        const array = sql.split('/')
        let path = ''

        for (let i in array) {
            if (array[i] === 'migrations') {
                path += array[i]
                break
            }
            else {
                path += array[i] + '/'
            }
        }
        return path
    },

    // Pega a versão que está o arquivo do push
    getFileVersion: (sqlPath) => {

        const fileVersion = sqlPath.split('/')
        const i = fileVersion.length - 2

        return fileVersion[i]
    },

    // Compara versão do arquivo do push com a versão que está em homologação
    compareVersions: (homologVersion, fileVersion) => {
        if(fileVersion === homologVersion){
            return false
        }
        return true
    }
}