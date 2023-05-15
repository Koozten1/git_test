require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./router/router.js')
const errMIdaleware  = require('./middlewares/error-midalware.js')
const db = require('./DB.js')

const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(router)
app.use(errMIdaleware)

const start_server = async() =>{
    try{
        app.listen(PORT, ()=>{
            console.log('server')
        })
    }catch (e){
        console.log(e)
    }
}

start_server()