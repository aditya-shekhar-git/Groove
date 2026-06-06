import React, { useState } from 'react'
import { dummyConnectionsData as connections,
   dummyFollowersData as followers ,
   dummyFollowingData as following,
   dummyPendingConnectionsData as pendingConnections } from '../assets/assets'
import { MessageSquare, UserCheck, UserPlus, UserRoundPen, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Connections = () => {

  const navigate = useNavigate()

  const [currentTab,setCurrentTab] = useState('Followers')

  const dataArray = [
    {label : 'Followers', value: followers,icon: Users},
    {label : 'Following', value: following,icon: UserCheck},
    {label : 'Pending', value: pendingConnections,icon: UserRoundPen},
    {label : 'Connections', value: connections,icon: UserPlus},
  ]
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6 '>

        {/* Title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'> Connections </h1>
          <p className='text-slate-600'>Connect to your family and friends </p>
        </div>

        {/* Counts */}
        <div className='mb-8 flex flex-wrap gap-6'>
          {dataArray.map((item,index)=>(
            <div key={index} className='flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md'>
              <b>{item.value.length}</b>
              <p className='text-slate-600'>{item.label}</p>
            </div>
          ))}
        </div>

        {/*Tab */}
        <div className='incline-flex flex-wrap shadow-sm items-center border border-gray-200 rounded-md p-1 bg-white '>
          {
            dataArray.map((tab)=>(
              <button onClick={()=>setCurrentTab(tab.label)} key={tab.label} className={`flex items-center cursor-pointer transition-colors text-sm rounded-md px-3 py-1 ${currentTab === tab.label ? 'bg-white font-medium text-black' : 'text-gray-500 hover:text-black'}`}>
                <tab.icon className='w-4 h-4'/>
                <span className='ml-1'>{tab.label}</span>
                {tab.count !== undefined &&(
                  <span className='ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full '>{tab.count}</span>
                )}
              </button>
            ))
          }
        </div>

        {/*Connections */}
        <div className=' flex flex-wrap mt-6 gap-6'>
          {dataArray.find((item)=>item.label===currentTab).value.map((user)=>(
            <div key={user._id} className='w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md'>
              <img src={user.profile_picture} className='rounded-full h-12 w-12 shadow-md mx-auto' />
              <div className='flex-1 '>
                <p className='text-slate-700 font-medium'>{user.full_name}</p>
                <p className='text-slate-700 '>@{user.username}</p>
                <p className='text-gray-600 text-sm'>{user.bio.slice(0,30)}...</p>
                <div className='flex max-sm:flex-col gap-2 mt-4 '>
                  {
                    <button onClick={()=> navigate(`/profile/${user._id}`)} className='|w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'>
                      View Profile 
                    </button>
                  }

                  {

                    currentTab === 'Following' && (
                      <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer'>
                        Unfollow
                      </button>
                    )
                  }
                   {

                    currentTab === 'Pending' && (
                      <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer'>
                        Accept
                      </button>
                    )
                  }
                   {

                    currentTab === 'Connections' && (
                      <button onClick={()=>navigate(`/messages/${user._id}`)} className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer flex items-center justify-center'>
                        <MessageSquare className='h-4 w-4'/>
                        Message
                      </button>
                    )
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  )
}

export default Connections