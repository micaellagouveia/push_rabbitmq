module.exports = {
    checkSql: (modified, added) => {

        for (let i in modified) {
            if (modified[i].includes('.sql')) return modified[i]
        }
        for (let i in added) {
            if (added[i].includes('.sql')) return added[i]
        }
        return ''
    },

    getPath: (sql)=> {
        const array = sql.split('/')
        let path = ''
        for(let i in array){
            if(array[i] === 'migrations'){
                path += array[i] + '/'
                break
            } 
            else {
                path += array[i] + '/'
            }
        }
        return path
    }
}