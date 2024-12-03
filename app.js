const express = require('express')
const app = express()
const cors = require('cors')
const taxData = require('./taxdata.json')

const PORT = 3001

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).send()
})

//Middleware
const requireState = (req, res, next) => {
    if (req.body.state === undefined) {
        res.status(400).send({ message: "No state data in request", "requestBody": req.body })
        return
    }
    next()
}
const requireAmount = (req, res, next) => {
    if (req.body.amount === undefined) {
        res.status(400).send({
            message: "No amount data in request",
            "requestBody": req.body
        })
        return
    }
    next()
}

app.post("/getTaxRate", requireState, (req, res) => {
    console.log('received getTaxRate request')
    console.log(`Request body : ${JSON.stringify(req.body)}`)
    const state = req.body.state.toUpperCase()
    const amount = Number(req.body.amount)
    const taxRate = taxData[state]
    if (taxRate === undefined) {
        res.status(404).send({
            'message': `Could not find data for state : ${state}`,
            "requestBody": req.body
        })
        return
    }

    const response = {
        "state": state,
        "taxRate": taxRate
    }
    console.log(`Sending Response : ${JSON.stringify(response)}\n`)
    res.status(200).send(response)
})

app.post("/getTaxAmount", requireState, requireAmount, (req, res) => {
    console.log('received getTaxAmount request')
    console.log(`Request body : ${JSON.stringify(req.body)}`)
    const state = req.body.state.toUpperCase()
    const amount = Number(req.body.amount)
    const taxRate = taxData[state]
    if (taxRate === undefined) {
        res.status(404).send({
            'message': `Could not find data for state : ${state}`,
            "requestBody": req.body
        })
        return
    }
    const response = {
        "state": state,
        "amount": amount,
        "taxAmount": amount * taxRate
    }
    console.log(`Sending Response : ${JSON.stringify(response)}\n`)
    res.status(200).send(response)
})

app.post("/getTotalPurchasePrice", requireState, requireAmount, (req, res) => {
    console.log('received getTotalPurchasePrice request')
    console.log(`Request body : ${JSON.stringify(req.body)}`)
    const state = req.body.state.toUpperCase()
    const amount = Number(req.body.amount)

    const taxRate = taxData[state]
    if (taxRate === undefined) {
        res.status(404).send({
            'message': `Could not find data for state : ${state}`,
            "requestBody": req.body
        })
        return
    }
    const response = {
        "state": state,
        "amount": amount,
        "totalPrice": amount + (amount * taxRate),
        "taxAmount": amount * taxRate,
        "taxRate": taxRate
    }
    console.log(`Sending Response : ${JSON.stringify(response)}\n`)
    res.status(200).send(response)
})

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
})