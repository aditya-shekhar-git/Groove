import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

// Add Post

export const addPost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { content, postType } = req.body;
        const images = req.files || [];

        let image_urls = [];

        if (images.length > 0) {
            image_urls = await Promise.all(
                images.map(async (image) => {
                    const fileBuffer = fs.readFileSync(image.path);

                    console.log('Uploading:', image.originalname);
                    console.log('File size:', fileBuffer.length);

                    const response = await imagekit.files.upload({
                        file: fileBuffer.toString('base64'),
                        fileName: image.originalname,
                    });

                    console.log('Uploaded:', response.filePath);

                    return `${process.env.IMAGEKIT_URL_ENDPOINT}${response.filePath}`;
                })
            );
        }

        const post = await Post.create({
            user: userId,
            content,
            image_urls,
            postType
        });

        return res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post
        });

    } catch (error) {
        console.error('Add post error:', error);

        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to create post'
        });
    }
};


//Get Posts
export const getFeedPosts = async (req,res) => {
    try {
        const {userId} = req.auth()
        const user = await User.findById(userId)

        //User connections and followings
        const userIds = [userId, ...(user.connections || []), ...(user.following || [])]
        const posts = await Post.find({user:{$in:userIds}}).populate('user').sort({createdAt:-1});

        res.json({success:true,posts})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

//Like Posts
export const likePost = async (req,res) => {
    
    try {
        const {userId} = req.auth();
        const {postId} = req.body;

        const post = await Post.findById(postId)

        if(post.likes_count.includes(userId)){
            post.likes_count = post.likes_count.filter(user => user!==userId)
            await post.save()
            res.json({success:true, message:'Post unliked'});
        }
        else{
            post.likes_count.push(userId)
            await post.save()
            res.json({success:true,message:'Post liked'})
        }
    } catch (error) {
         console.log(error);
        res.json({success:false, message:error.message});
    }
}