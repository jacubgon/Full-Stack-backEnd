const { json } = require ('express')
const morgan = require ('morgan')
const cors = require ('cors')

// const candidates = require ('../routes/candidatesRoute')
const companies = require ('../routes/companies')
const offers = require ('../routes/offers')

module.exports = function (app) {
    app.use(cors())
    app.use(morgan())
    app.use(json())

    // app.use('/candidates', candidates)
    app.use('/companies', companies)
    app.use('/offers', offers)
}