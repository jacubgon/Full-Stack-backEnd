const { json } = require ('express')
const morgan = require ('morgan')
const cors = require ('cors')

module.exports = function (app) {
    app.use(cors())
    app.use(morgan())
    app.use(json())

}