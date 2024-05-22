const bcryptjs= require('bcryptjs')
const jwt= require('jsonwebtoken')
require('dotenv').config()
//req handler for user or author registration

const createUserOrAuthor=async(req,res)=>{
    //get users and authors collection object
    const usersCollectionObj=req.app.get('usersCollection')
    const authorsCollectionObj=req.app.get('authorsCollection')
    
    //get user or author
    const user=req.body

    //check duplicate user
    if(user.userType=="user"){
        //find user by username
        let dbuser=await usersCollectionObj.findOne({username:user.username})
        if(dbuser!=null){
           return res.send({message:"User already exists"})
        }
    }
    //check duplicate author
    if(user.userType=='author'){
        //find user by username
        let dbuser=await authorsCollectionObj.findOne({username:user.username})
        if(dbuser!=null){
           return res.send({message:"Author already exists"})
        }

    }

    //hash password
    const hashedPassword=await bcryptjs.hash(user.password,7)
    //replace with hash password
    user.password=hashedPassword;

    //save user
    if(user.userType=='user'){
        await usersCollectionObj.insertOne(user)
        res.send({message:"User Created"})
    }

    //save author
    if(user.userType=='author'){
        await authorsCollectionObj.insertOne(user)
        res.send({message:"Author Created"})
    }



}

const loginUserOrAuthor=async(req,res)=>{
    //get users and authors collection object
    const usersCollectionObj=req.app.get('usersCollection')
    const authorsCollectionObj=req.app.get('authorsCollection')
    
    //get user or author
    const userCred=req.body
    //verify username of user
    if(userCred.userType=='user'){
        let dbuser=await usersCollectionObj.findOne({username:userCred.username})
        if(dbuser==null){
            return res.send({message:"Invalid username"})
        }
        else{
            let status= await bcryptjs.compare(userCred.password,dbuser.password)//return bool value
            if(status==false){
                return res.send({message:"Invalid password"})
            }
            else{
                //create jwt token
                const signedtoken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:'1d'})
                delete dbuser.password
                res.send({message:"Login success",token:signedtoken,user:dbuser})
            }
        }
    }

    //verify username of author
    if(userCred.userType=='author'){
        let dbuser=await authorsCollectionObj.findOne({username:userCred.username})
        if(dbuser==null){
            return res.send({message:"Invalid username"})
        }
        else{
            let status=await bcryptjs.compare(userCred.password,dbuser.password)//return bool value
            //console.log(status)
            if(status==false){
                return res.send({message:"Invalid password"})
            }
            else{
                //create jwt token
                const signedtoken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:'1d'})
                delete dbuser.password
                res.send({message:"Login success",token:signedtoken,user:dbuser})
            }
        }
    }

}

module.exports={createUserOrAuthor,loginUserOrAuthor};