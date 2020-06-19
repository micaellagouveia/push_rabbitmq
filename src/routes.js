const routes = require('express').Router()
const receiver = require('./receiver.js')
const Push = require('./models/Push')
const utils = require('./utils')
const repository = require('./requests/repository')

routes.get('/', (req, res) => {
    return res.json({ Hello: "World" })
})

routes.post('/rabbitmq', (req, res) => {

    const push = new Push(req.body)

    const branch = push.branch
    let modified = push.modified
    let added = push.added

   // console.log('Branch: ' + branch)

    if (branch === 'develop') {
        /*console.log('MODIFIED')
        console.log(modified)
        console.log('ADDED')
        console.log(added)*/

      /*  const sql = utils.checkSql(modified, added)
        

        console.log('PATH')
        console.log(sql)

        const path = utils.getPath(sql)
        console.log(path)*/

            const pom = repository.getPomFile(push.id)

            console.log(pom)
            return pom
    }

})


module.exports = routes