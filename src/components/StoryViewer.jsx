import { BadgeCheck, X } from 'lucide-react'
import React from 'react'

const StoryViewer = ({viewStory ,setViewStory}) => {

  const handleClose=()=>{
    setViewStory(null)
  }

  return (
    <div className='fixed h-screen bg-black inset-0 bg-opacity-90 z-100 flex items-center justify-center ' style={{backgroundColor:viewStory.media_type === 'text' ? viewStory.background_color : '#000000'}}>

        {/*Progress Bar*/}
    <div className='absolute top-0 left-0 w-full h-1 bg-gray-700'>

        <div className='bg-white h-full transition-all duration-100 linear ' style={{width:'50'}}>

        </div>
        
    </div>
    {/*User Info - Top Left*/}
    <div className='absolute top-4 flex items-center left-4 space-x-3 p-2 px-3 sm:p-4 sm:px-8 backdrop-blur-2xl roundede bg-black/50'>
     <img src={viewStory.user?.profile_picture} alt="" className='size-7 sm:size-8 rounded-full object-cover border border-white' />
     <div className='text-white font-medium flex items-center gap-1.5'>
      <span>{viewStory.user?.full_name}</span>
      <BadgeCheck size={18}/>
     </div>
    </div>
    <div>

      {/*Close Button  */}
      <button onClick={handleClose} className='absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none'>
        <X className='w-8 h-8 hover:scale-110 transition cursor-pointer'/>
      </button>
    </div>
    </div>

    
  )
}

export default StoryViewer