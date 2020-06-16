module.exports = {
    checkSql: (modified, added) => {

        for (let i in modified) {
            if (modified[i].includes('.sql')) return modified[i]
        }
        if (!check) {
            for (let i in added) {
                if (added[i].includes('.sql')) return added[i]
            }
        }
        return ''
    },
}