import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Story from '../models/Story.js';
import User from '../models/User.js';
import { inngest } from '../inngest/index.js';
import { toFile } from '@imagekit/nodejs'

// Add User Story
export const addStories = async (req, res) => {
  try {
    const { userId } = req.auth()
    const { content, media_type, background_color } = req.body
    const media = req.file

    let media_url = ''

    if (media_type !== 'text' && media) {
      const buffer = fs.readFileSync(media.path)
      const response = await imagekit.files.upload({
        file: await toFile(buffer, media.originalname),
        fileName: media.originalname,
        folder: '/stories',
      })
      fs.unlink(media.path, () => {})
      media_url = response.url
    }

    const story = await Story.create({
      user: userId,
      content,
      media_url,
      media_type,
      background_color,
    })

    res.json({ success: true, message: 'Story created' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get User Story

export const getStories = async (req, res) => {
  try {
    const { userId } = req.auth()
    const user = await User.findById(userId)

    if (!user) {
      return res.json({ success: false, message: 'User not found' })
    }

    const userIds = [userId, ...user.connections, ...user.following]

    const stories = await Story.find({ user: { $in: userIds } })
      .populate('user')
      .sort({ createdAt: -1 })

    res.json({ success: true, stories })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}