import express from 'express'
import { upload } from '../configs/multer.js';
import { protect } from '../middlewares/auth.js';
import { addStories, getStories } from '../controllers/storyController';

const storyRouter = express.Router();

storyRouter.post('/create',upload.single('media'),protect,addStories)
storyRouter.get('/get',protect,getStories)

export default storyRouter