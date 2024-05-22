//create mini express app
const exp=require("express")
const adminApp=exp.Router()
//---------------------------------------------

//define routes


adminApp.get('/test-admin',(req,res)=>{
    res.send({message:"from admin"})
})








//export adminApp
module.exports=adminApp