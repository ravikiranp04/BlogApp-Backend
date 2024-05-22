//create express app
const exp=require("express")
const app=exp()
const path=require('path') //core module
//accessing content of enviroment variable file
require('dotenv').config()//process.env.PORT
//---------------------------------------
//Import the apis
const userApp=require('../Backend/APIs/user-api')
const authorApp=require('../Backend/APIs/author-api')
const adminApp=require('../Backend/APIs/admin-api')
//--------------------------------------------------

//handover req to specific route based on start of paths
app.use('/user-api',userApp)
app.use('/author-api',authorApp)
app.use('/admin-api',adminApp)


//-------------------------------------------------------
//add body parser
app.use(exp.json())
//------------------------------------------------------------

//Replace react build in http web server
app.use(exp.static(path.join(__dirname,'../frontend/build')))




//-----------------------------
//Error Handler
app.use((res,req,next,err)=>{
    res.send({status:"Error",message:err.message})
})

//Link with mongodb server
const mongoClient=require('mongodb').MongoClient //importing
mongoClient.connect(process.env.DB_URL)
.then(client=>{
    //get database object
    const blogDBObj=client.db('blogdb')
    //create collection objects
    const usersCollection=blogDBObj.collection('users')
    const authorsCollection=blogDBObj.collection('authors')
    const articlesCollection=blogDBObj.collection('articlesCollection')
    //share collection objs with APIS
    app.set('usersCollection',usersCollection)
    app.set('authorsCollection',authorsCollection)
    app.set('articlesCollection',articlesCollection);
    console.log('DB connection success')
})
.catch(err=>{
    console.log("Err in DB connect",err)
})






















//Syncronous error handling middleware
app.use((err,req,res,next)=>{
    res.send({status:"error",message:err.message})
})

//-------------------------------------------------------------------

//get port number from .env
const port=process.env.PORT || 4000
//Assign port number to http server
app.listen(port,()=>{console.log(`server on ${port}`)})