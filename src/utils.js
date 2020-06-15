module.exports = {
    checkSql: (modified, added) => {
        let check = false

        for (let i in modified) {
            if (modified[i].includes('.sql')) check = true
        }
        if (!check) {
            for (let i in added) {
                if (added[i].includes('.sql')) check = true
            }
        }
        return check
    }
}