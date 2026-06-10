import path from 'path';
import imagekit from '../configs/imageKit.js';
import User from '../models/User.js'
import fs from'fs'

export const getUserData = async (req,res) => {

    try {
        const {userId} = req.auth();
        const user = await User.findById(userId)

        if(!user){
            return res.json({success:false,message:"user not fount"})
        }
        res.json({success:true,user})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//Update user data
export const updateUserData = async (req,res) => {

    try {
        const {userId} = req.auth();
        const {username,bio,location,full_name} = req.body;

        const tempUser = await User.findById(userId);

        !username && (username = tempUser.username)

        if(tempUser.username !== User.findOne(username)){
            const user = User.findOne(username)
            if(user){
                username = tempUser.username;
            }
        }
        const updatedData = {
            username,
            bio,    
            location,
            full_name
        }

        const profile = req.files.profile && req.files.profile[0]
        const cover = req.files.profile && req.files.profile[0]

        if(profile){
            const buffer = fs.readFileSync(profile.path)
            const response = await imagekit.upload({
                file : buffer,
                fileName : profile.originalname,
            })
            const url = await imagekit.url({
                path:response.filePath,
                transformation:[
                    {quality:'auto'},
                    {width:'512'},
                    {format:'webp'}
                ]
            })
            updatedData.profile_picture = url;
        }

        if(cover){
            const buffer = fs.readFileSync(cover.path)
            const response = await imagekit.upload({
                file : buffer,
                fileName : cover.originalname,
            })
            const url = await imagekit.url({
                path:response.filePath,
                transformation:[
                    {quality:'auto'},
                    {width:'1280'},
                    {format:'webp'}
                ]
            })
            updatedData.cover_photo = url;
        }

        const user = await User.findByIdAndUpdate(userId,updatedData,{new:true})

        res.json({success:true,user,message:'Profile Updated successfully !'})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


// Find User using username, email, location, name

export const discoverUsers = async (req,res) => {
    try {
        const {userId} = req.auth();
        const {input} = req.body;
        

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}