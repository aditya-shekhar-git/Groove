import React from 'react'
import {useState} from 'react'
import {ArrowLeft,  Star,  TextIcon, Upload} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/react'
import api from '../api/axios'

const StoryModal = ({setShowModal, fetchStories}) => {

  const bgColors = [
    "#4f46e5",
    "#7c3aed",
    "#db2777",
    "#e11d48",
    "#ca8a04",
    "#0d9488"
  ]

  const [mode,setMode]=useState("text")
  const [background,setBackground]=useState(bgColors[0])
  const [text,setText]=useState("")
  const [media,setMedia]=useState(null)
  const [previewUrl,setPreviewUrl]=useState(null)

  const { getToken } = useAuth()

  const MAX_VIDEO_DURATION = 60;  //seconds
  const MAX_VIDEO_SIZE = 50;  //mb


  const handleMediaUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.type.startsWith('video')) {
    if (file.size > MAX_VIDEO_SIZE * 1024 * 1024) {
      toast.error('Video size is limited to 50 MB')
      setMedia(null)
      setPreviewUrl(null)
      return
    }
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      if (video.duration > MAX_VIDEO_DURATION) {
        toast.error('Video duration exceeds 1 minute.')
        setMedia(null)
        setPreviewUrl(null)
      } else {
        setMedia(file)
        setPreviewUrl(URL.createObjectURL(file))
        setText('')
        setMode('media')
      }
    }
    video.src = URL.createObjectURL(file)
  } else if (file.type.startsWith('image')) {
    setMedia(file)
    setPreviewUrl(URL.createObjectURL(file))
    setText('')
    setMode('media')
  }
}

  const handleCreateStory = async () => {
  if (mode === 'media' && !media) {
    throw new Error('Please select an image or video')
  }
  if (mode === 'text' && !text.trim()) {
    throw new Error('Please enter some text')
  }

  const media_type =
    mode === 'media' ? (media.type.startsWith('image') ? 'image' : 'video') : 'text'

  const formData = new FormData()
  formData.append('content', text)
  formData.append('media_type', media_type)
  if (media) formData.append('media', media)
  formData.append('background_color', background)

  const token = await getToken()
  const { data } = await api.post('/api/story/create', formData, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!data.success) throw new Error(data.message)

  setShowModal(false)
  fetchStories()
}
  
  
  return (
    <div className='fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-4 flex items-center justify-center'>
          <button onClick={() => setShowModal(false)} className='text-white p-2 cursor-pointer'>
            <ArrowLeft />
          </button>
          <h2 className='text-lg font-semibold'>Create Story</h2>
          <span className='w-10'></span>
        </div>

        <div className='rounded-lg h-96 flex items-center justify-center relative' style={{backgroundColor:background}}> 

          {mode==="text" && (
            <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder= "What's on your mind?" className='w-full h-full bg-transparent text-white p-4 resize-none outline-none text-center text-lg'/>
          )}

          {mode=="media" && previewUrl && (
            media?.type.startsWith('image')?(
            <img src={previewUrl} className='object-contain max-h-full'/>
            ) : (
              <video src={previewUrl} className='object-contain max-h-full'/>
            )
          )}
        </div>

        <div className='flex mt-4 gap-2'>
          {bgColors.map((color)=>(
            <button key={color} className='w-6 h-6 rounded-full ring cursor-pointer' style={{backgroundColor:color}} onClick={()=>{
              setBackground(color)}}/>
          ))}
        </div>

        <div className='flex gap-2 mt-4 '> 
          <button onClick={()=>{setMedia(null),setMode('text'),setPreviewUrl(null)}} className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${mode=== "text" ? "bg-white text-black" : "bg-zinc-800"}`}>
            <TextIcon size={18}/>Text
          </button>
          <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${mode === 'media'? "bg-white text-black" : "bg-zinc-800"}` }>
            <input onChange={handleMediaUpload} type="file" accept='image/*,video/*' className='hidden' />
           
             <Upload size={18}/>Photo/Video
          
          </label>
        </div>

          <button onClick={()=>{
            toast.promise(handleCreateStory(),{
              loading:"Saving...",
              success: 'Story created successfully',
              error: (e) => e.message,
            })
          }} className='flex items-center justify-center text-white py-3 mt-4 gap-2 w-full rounded bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer'>
            <Star/>Create Story
          </button>
    
      </div>
    </div>
  )
} 

export default StoryModal