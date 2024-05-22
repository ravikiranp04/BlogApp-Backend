//create mini express app
const exp=require("express")
const userApp=exp.Router()
const {createUserOrAuthor,loginUserOrAuthor}=require('./Util')
//add body parser
userApp.use(exp.json())
//---------------------------------------------
const expresshandler=require('express-async-handler')
let {verifyToken}=require('../Middlewares/verifyToken')

//midddle ware of objects
let usersCollection;
let articlesCollection;
userApp.use((req,res,next)=>{
    usersCollection=req.app.get('usersCollection')
    articlesCollection=req.app.get('articlesCollection')
    next()
})
// User Creation 
userApp.post('/user',expresshandler(createUserOrAuthor))

//User Login
userApp.post('/login',expresshandler(loginUserOrAuthor))



//read articles of all others
userApp.get('/articles',verifyToken,expresshandler(async(req,res)=>{
    const articlesList=await articlesCollection.find({status:true}).toArray();
    res.send({message:"All articles",payload:articlesList});
}))

//write comment for an article by its articleid
userApp.post('/comment/:articleId',expresshandler(async(req,res)=>{

    //get articles from url
    let articleIdfromUrl=(+req.params.articleId);
    //console.log(req.params.articleId)
    //get comments obj from req
    const userComment=req.body;
    //console.log(userComment)
    //add user comment object as an elemen tto comments array of article document
    await articlesCollection.updateOne({articleId:articleIdfromUrl},{$addToSet:{comments:userComment}})
    //send res
    res.send({message:"User Comment added"})
}))


//export userApp
module.exports=userApp