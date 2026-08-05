import path from 'path';
import imagekit from '../configs/imageKit.js';
import User from '../models/User.js'
import fs from'fs'
import Connection from '../models/Connection.js';
import { connect } from 'http2';
import { connection } from 'mongoose';

export const getUserData = async (req,res) => {

    try {
        const {userId} = req.auth();
        const user = await User.findById(userId)

        if(!user){
            return res.json({success:false,message:"user not found"})
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
        let {username: requestUsername,bio: requestBio,location: requestLocation,full_name: requestFullName} = req.body;

        const tempUser = await User.findById(userId);
        if (!tempUser) {
            return res.json({ success:false, message:'User not found' });
        }

        let username = requestUsername?.trim() || tempUser.username;
        const bio = requestBio ?? tempUser.bio;
        const location = requestLocation ?? tempUser.location;
        const full_name = requestFullName ?? tempUser.full_name;

        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== userId) {
          return res.status(400).json({
          success: false,
          message: "Username is already taken."
          });
        }

        const updatedData = {
            username,
            bio,
            location,
            full_name
        }

        const profile = req.files.profile && req.files.profile[0]
        const cover = req.files.cover && req.files.cover[0]

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

        const allUsers = await User.find({
            
            $or: [
                {username : new RegExp(input , 'i')},
                {email : new RegExp(input , 'i')},
                {location : new RegExp(input , 'i')},
                {full_name : new RegExp(input , 'i')},
            ]
        })

        const filterUsers = allUsers.filter(user => user._id !==userId);
        res.json({success:true,user:filterUsers});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//Follow User

export const followUsers = async (req,res) => {
    try {
        const {userId} = req.auth();
        const {id} = req.body;

        const user = await User.findById(userId);

        if(user.following.includes(id)){
            return res.json({success:false,message:`You are already following ${user.username}`})
        }

        user.following.push(id);
        await user.save()

        const toUser = await User.findById(id)
        toUser.followers.push(userId);
        await toUser.save();

        res.json({success:true,message:`Now you are ollowing ${user.username}`})
    

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//Unfollow User

export const unfollowUsers = async (req,res) => {
    try {
        const {userId} = req.auth();
        const {id} = req.body;

        const user = await User.findById(userId);
        user.following = user.following.filter(user => user !== id);
        await user.save();

        const toUser = await User.findById(id);
        if (!toUser) {
            return res.json({ success:false, message:'Target user not found' });
        }
        toUser.followers = toUser.followers.filter(user => user !== userId);
        await toUser.save();

        res.json({success:true,message:`You are no longer following ${id}`})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }  
}


//Send Connection Request

export const sendConnectionRequest = async (req,res) => {
    
    try {
        
        const{userId} = req.auth();
        const {id} = req.body;

        // Limiting number of connection requests in last 24 hrs
        const last24Hours = new Date(Date.now() - 24*60*60*1000)
        const connectionRequests = await Connection.find({from_user_id:userId,created_at:{$gt:last24Hours}})

        if(connectionRequests.length>=20){
            return res.json({success:false,message:'Connection request limit exceded for last 24 hours'})
        }

        //Check if users are already connected
        const connection = await Connection.findOne({
            $or:[
                {from_user_id: userId,to_user_id:id},
                {from_user_id: id,to_user_id:userId},
            ]
        })

        if(!connection){
            await Connection.create({
                from_user_id: userId,
                to_user_id: id
            })
            return res.json({success:true ,message:"Connection request sent successfully"})
        }
        else if(connection && connection.status === 'accepted'){
            return res.json({success:false,message:`You are already connected with ${id.username}`})
        }
        return res.json({success:true,message:'Request Pending'})
        

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// Get User Connections

export const getUserConnections = async (req,res) => {
    try {
        const {userId} = req.auth();
        const user = await User.findById(userId).populate('connections followers following')

        const followers = user.followers;
        const following = user.following;
        const connections = user.connections;

        const pendingConnections = (await Connection.find({to_user_id: userId,status:'pending'}).populate('from_user_id')).map(connection=>connection.from_user_id)

        res.json({success:true, connections, followers, following , pendingConnections})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//Accept Connection Request 
export const acceptConnectionRequest = async (req,res) => {
    try {

        const {userId} = req.auth();
        const {id} = req.body;

        const connection = await Connection.findOne({from_user_id: id, to_user_id: userId})

        if(!connection){
            return res.json({success:false ,message: 'Connection not found'})
        }

        const user = await User.findById(userId)
        user.connections.push(id);
        await user.save();

        connection.status = 'accepted'
        await connection.save()

        res.json({success:true, message:'Connection accepted successfully'})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}