const express = require('express')
const morgan = require('morgan')

const app = express()
const HOST = '0.0.0.0'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(require('./receiver'))

app.listen(process.env.PORT || 3000, HOST)
