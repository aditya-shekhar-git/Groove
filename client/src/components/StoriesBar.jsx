import React, { useEffect, useState } from 'react'
import { dummyStoriesData } from '../assets/assets'
import { Plus } from 'lucide-react'
import moment from 'moment'
import StoryModal from './StoryModal'
import StoryViewer from './StoryViewer'

const StoriesBar = () => {
  const [stories, setStories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [viewStory, setViewStory] = useState(null)

  const fetchStories = async () => {
    setStories(dummyStoriesData)
  }

  useEffect(() => {
    fetchStories()
  }, [])

  return (
    <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl  overflow-x-auto px-4'>
      <div className='flex gap-4 pb-5'>
        
        {/* Create Story Card */}
        <div onClick={() => setShowModal(true)} className='relative rounded-lg shadow-sm min-w-[120px] max-w-[120px] max-h-40 aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white'>
          <div className='h-full flex flex-col items-center justify-center p-4'>
            <div className='size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3'>
              <Plus className='w-5 h-5 text-white' />
            </div>
            <p className='text-sm font-medium text-slate-700 text-center'>
              Create Story
            </p>
          </div>
        </div>

        {/* Story Cards */}
        {stories.map((story, index) => (
          <div
            onClick={()=> setViewStory(story)}
            key={index}
            className='relative overflow-hidden rounded-lg shadow-sm min-w-[120px] max-w-[120px] max-h-40 aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white'
          >
            {story.media_type === 'image' && (
              <img
                src={story.media_url}
                alt='Story'
                className='w-full h-full object-cover hover:scale-110 transition duration-500'
              />
            )}

            {story.media_type === 'video' && (
              <video
                src={story.media_url}
                className='w-full h-full object-cover hover:scale-110 transition duration-500'
                muted
                autoPlay
                loop
              />
            )}

            {story.media_type === 'text' && (
              <div className='absolute inset-0 bg-black flex items-center justify-center p-4'>
                <p className='text-white text-sm text-center'>
                  {story.content}
                </p>
              </div>
            )}

            <img
              src={story.user.profile_picture}
              alt='User'
              className='absolute size-8 top-3 left-3 z-10 rounded-full ring ring-gray-100 shadow'
            />

            <p className='absolute top-18 left-3 z-10 text-white/80 text-sm truncate max-w-24'>
              {story.content}
            </p>

            <p className='absolute bottom-1 right-2 z-10 text-white text-xs'>
              {moment(story.createdAt).fromNow()}
            </p>
          </div>
        ))}
      </div>
      {/* Add Story Modal */}
      {showModal && <StoryModal setShowModal={setShowModal} fetchStories={fetchStories} />}

      {/* View Story Modal */}
      {viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />}
    </div>
  )
}

export default StoriesBar