import React from 'react'
import { dummyUserData } from '../assets/assets'
import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react'

const UserCard = ({user}) => {

  const currentUser=dummyUserData

  const handleFollow = async () => {
    
  }
  const handleConnectionRequest = async () => {
    
  }
  return (
    <div key={user._id} className='p-4 pt-6 flex flex-col justify-between w-72 shadow border border-gray-200 rounded-md'>
      <div className='text-center'>
        <img src={user.profile_picture} className='rounded-full w-16 shadow-md mx-auto ' />
        <p className='mt-4 font-semibold'>{user.full_name}</p>
        {user.username && <p className='text-gray-500 font-light'>@{user.username}</p>}
        {user.bio && <p className='text-gray-600 text-center text-sm mt-2 px-4'>{user.bio}</p>}
      </div>

      <div className='flex items-center gap-2 justify-center mt-4 text-xs text-gray-600'>
  <div className='flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1'>
    <MapPin className='w-4 h-4' />
    <span>{user.location}</span>
  </div>

  <div className='flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1'>
    <span>{user.followers?.length || 0}</span>
    <span>Followers</span>
  </div>
</div>

<div className='flex gap-2 mt-4'>
  <button
    onClick={handleFollow}
    disabled={currentUser?.following?.includes(user._id)}
    className='flex-1 rounded-md flex items-center justify-center gap-2 text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed'
  >
    <UserPlus className='w-4 h-4' />
    {currentUser?.following?.includes(user._id) ? 'Following' : 'Follow'}
  </button>

  <button
    onClick={handleConnectionRequest}
    className='flex items-center justify-center border border-slate-300 w-16 text-slate-500 rounded-md cursor-pointer active:scale-95 transition hover:bg-slate-50'
  >
    {currentUser?.connections?.includes(user._id) ? (
      <MessageCircle className='w-4 h-4 group-hover:scale-105 transition' />
    ) : (
      <Plus className='w-4 h-4 group-hover:scale-105 transition' />
    )}
  </button>
</div>

    </div>
  )
}

export default UserCard