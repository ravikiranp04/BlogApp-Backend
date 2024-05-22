//create mini express app
const exp=require("express")
const authorApp=exp.Router()
const {createUserOrAuthor,loginUserOrAuthor}=require('./Util')
const expressAsyncHandler=require('express-async-handler')
let {verifyToken}=require('../Middlewares/verifyToken')

//add body parser
authorApp.use(exp.json())
//---------------------------------------------
let authorsCollection;
let articlesCollection;
authorApp.use((req,res,next)=>{
    authorsCollection=req.app.get('authorsCollection')
    articlesCollection=req.app.get('articlesCollection')
    next()
})
//Author create
authorApp.post('/user',expressAsyncHandler(createUserOrAuthor))

//author Login
authorApp.post('/login',expressAsyncHandler(loginUserOrAuthor))


//to save new article
authorApp.post('/new-article',verifyToken,expressAsyncHandler(async(req,res)=>{
    
    //get new article from client
    const newArticle=req.body;
    //save new article to articlesCollection
    await articlesCollection.insertOne(newArticle)
    //send res
    res.send({message:"New Article added"})
}))

//view articles
authorApp.get('/articles/:username',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get username from url
    const usernameAuthor=req.params.username
    //get articles of current author
    let articlesList= await articlesCollection.find({username:usernameAuthor}).toArray();
    res.send({message:"Articles found",payload:articlesList})
}))

//edit articles
authorApp.put('/article',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get modified article
    const modifiedArticle=req.body;

    let articleAfterModify=await articlesCollection.findOneAndUpdate({articleId:(+modifiedArticle.articleId)},{$set:{...modifiedArticle}},{returnDocument:'after'})
    res.send({message:"Article modified",payload:articleAfterModify})
}))

//Delete article by soft delete
authorApp.put('/article/:articleId',verifyToken,expressAsyncHandler(async(req,res)=>{
    let articleIfofUrl= Number(req.params.articleId)
    console.log(articleIfofUrl)
    let art=req.body;
    if(art.status==true){
        let result=await articlesCollection.updateOne({articleId:articleIfofUrl},{$set:{status:false}})
        if(result.modifiedCount==1){
            res.send({message:"article deleted"})
        }
        console.log(result)
    }
    if(art.status==false){
        let result=await articlesCollection.updateOne({articleId:articleIfofUrl},{$set:{status:true}})
        if(result.modifiedCount==1){
            res.send({message:"article restored"})
        }
    }
    
}))

//export authorApp
module.exports=authorApp