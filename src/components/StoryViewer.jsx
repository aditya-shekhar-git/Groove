import React from 'react'

const StoryViewer = ({viewStory ,setViewStory}) => {
  return (
    <div className='fixed h-screen bg-black inset-0 bg-opacity-90 z-100 flex items-center justify-center ' style={{backgroundColor:viewStory.media_type === 'type' ? viewStory.background_color : '#000000'}}>

        {/*Progress Bar*/}
    <div className='absolute top-0 left-0 w-full h-1 bg-gray-700'>

        <div className='bg-white h-full transition-all duration-100 linear ' style={{width:'50'}}>

        </div>
        
    </div>

    </div>

    
  )
}

export default StoryViewer