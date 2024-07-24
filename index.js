const express = require('express')
const app = express()
port= process.env.PORT||3000
const fs = require('fs')
const authRoute = require('./routes/auth')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()
app.use(bodyParser.urlencoded())

app.get('/',(req,res)=>{
    res.send('hi')
})

app.use((req,res,next)=>{
    const reqString = `${req.method} ${req.url} ${Date.now()}\n`
    fs.writeFile('log.txt',reqString,{flag: 'a'},(err)=>{
        if(err){
            console.log('error')
        }
    });
    next()
});

app.use('/v1/auth',authRoute)

app.use((err,req,res,next)=>{
    const reqString = `${req.method} ${req.url} ${Date.now()} ${err.message}\n`
    fs.writeFile('error.txt',reqString,{flag: 'a'},(err)=>{
        if(err){
            console.log('error')
        }
    });
    res.status(500).send('Internal server error')
    next()
});

app.listen(port,()=>{
    mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log(`Server is running at ${port}`))
  .catch((error)=> console.log(error))
})
    

