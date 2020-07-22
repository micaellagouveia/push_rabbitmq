module.exports = {

    // Checa a existência de arquivo sql nas pastas adicionadas/modificadas no push
    checkSql: (array) => {

        for (let i in array) {
            if (array[i].includes('.sql')) return array[i]
        }
        return ''
    },

    // Pega o path em que o arquivo vai ser movido
    getPathFile: (sql, homologVersion, number) => {
        const array = sql.split('/')
        let path = ''

        const name = array[array.length - 1]

        const newName = updateName(name, homologVersion, number)

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
    },

    // pega o path para a função de resgatar os arquivos do pasta de homologação
    getFileTree: (sql, homologVersion) => {
        const array = sql.split('/')
        let path = ''

        for (let i = 0; i < array.length - 2; i++) { // length-2 pois o ultimo é o nome do arquivo, e o penultimo a versao antiga
            path += array[i] + '/'
        }
        return path + homologVersion
    },

    // retorna o numero que devo atribuir para atualizar o nome do arquivo novo
    lastNumber: (arrayFiles) => {
        let numbers = []
        let higher = 0

        for (let i in arrayFiles) {
            let array = arrayFiles[i].split('_')
            numbers[i] = array[2]
            if (numbers[i] >= higher) higher = numbers[i]
        }

        const number = digitFormat(parseInt(higher) + 1, 3)

        return number
    }
}

function updateName(name, homologVersion, number) {

    console.log('FUNÇÃO UPDATE NAME')
    console.log('name: ' + name)
    console.log('homologVersion: ' + homologVersion)
    console.log('number: ' + number)

    const array = name.split('_')
    array[1] = homologVersion
    array[2] = number

    return array.join('_')
}

function digitFormat(value, padding) {
    var zeroes = new Array(padding + 1).join("0");
    return (zeroes + value).slice(-padding);
}