import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../assets/assets'
import { Plus } from 'lucide-react'

const StoriesBar = () => {

  const [stories, setStories] = useState([])

  const fetchStories = async () => {
    setStories(dummyPostsData)
  }

  useEffect(() => {
    fetchStories()
  }, [])

  return (
    <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4'>

      <div className='flex gap-4 pb-5'>

        {/* Create Story Card */}
        <div className='rounded-lg shadow-sm min-w-30 max-w-30 max-h-40 aspect-3/4 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-linear-to-b from-indigo-50 to-white'>

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

        {
            stories.map((story,index) => (
              <div key={index} className='rounded-lg shadow-sm min-w-30 max-w-30 max-h-40 aspect-3/4 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white'>
                <img src={story.user.profile_picture} alt="Story" className='absolute size-8 top-3 left-3 z-10 rounded-full ring ring-gray-100 shadow' />
                <p className='absolute top-18 left-3 text-white/60 text-sm truncate max-w-24'>{story.content}</p>
                <p>{story.createdAt}</p>
              </div>
            ))
        }

      </div>
    </div>
  )
}

export default StoriesBar