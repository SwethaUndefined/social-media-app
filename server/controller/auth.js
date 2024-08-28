import bcrypt from "bcrypt";
import Jwt  from "jsonwebtoken";
import user from "../model/user"

/*REGISTER USER*/

export const register = async(req,res)=>{
 try {
    const {firstName,lastName,email,password,picturePath,friends,location,occupation} = req.body;
    const salt = await bcrypt.genSalt();
    console.log(salt,"============")
    const passwordHash = await bcrypt.hash(password,salt)
    const newUser = new user({
        firstName,
        lastName,
        email,
        password : passwordHash,
        picturePath,
        friends,
        location,
        occupation,
        viewedProfile : Math.floor(Math.random()*10000),
        impressions : Math.floor(Math.random()*10000)
    })
    const savedUser = await newUser.save();
    res.status(201).json(savedUser)
 } catch (error) {
    res.status(500).json({error : error.message})
 } 
}

/*LOGIN USER*/
export const login = async(req,res)=>{
 try {
    const {email,password} = req.body;
    const user = await user.findOne({email : email})
    if(!user){
        res.status(400).json({message : "User does not Exists"})
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        res.status(400).json({message : "Invalid Cridentials"})
    }
    const token = Jwt.sign({id : user._id},process.env.JWT_SECRET)
    delete user.password;
    res.status(200).json({token,user})
} catch (error) {
    res.status(500).json({error : error.message})
 }
}