const express = require('express')
const mongoose = require('mongoose')
require('dotenv/config')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')
const commentRoutes = require('./routes/comment')
const notifyRoutes = require('./routes/notify')
const { createServer } = require("http")
const { Server } = require("socket.io")
const { socketServer } = require('./socketServer')

const app = express()

//MIDDLEWARE
app.use( bodyParser.json() )
app.use( express.json() )
app.use(morgan("common"))

app.use( cors( {
    origin:'*'
}) )

const server = createServer(app)
const io = new Server( server, {
    cors:{
        origin: "*",
        methods: [ "GET", "POST","DELETE", "PATCH" ],
    }
} )


io.on( "connection",  (socket) => {
    // console.log( `User Connected: ${socket.id} ` )
    socketServer(io,socket)
} )


app.use( '/api/user', authRoutes )
app.use( '/user',  userRoutes )
app.use( '/api/post', postRoutes )
app.use( '/api/comment', commentRoutes )
app.use( '/api/notify', notifyRoutes )

mongoose.set("strictQuery", false);
const dburi = process.env.DB_CONNECTION
mongoose.connect(dburi)
console.log('connected to db')

server.listen(process.env.PORT)