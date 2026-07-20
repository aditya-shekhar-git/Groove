import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import { useUser , useAuth } from '@clerk/react'
import Layout from './pages/Layout'
import {Toaster} from 'react-hot-toast'
import Connections from './pages/Connections'
import { useEffect } from 'react'

const App = () => {
  const {user}=useUser()
  const {getToken} = useAuth()

  useEffect(()=>{
    
    if(user){
      getToken().then((token)=>console.log(token))
    }
  },[user])
  return (
    <>
    <Toaster/>
    <Routes>
      <Route path='/' element={!user ? <Login /> : <Layout />}>
        <Route index element={<Feed/>}/>
        <Route path='messages' element={<Messages/>}/>
        <Route path='messages/:id' element={<ChatBox/>}/>
        <Route path='discover' element={<Discover/>}/>
        <Route path='profile' element={<Profile/>}/>
        <Route path='profile/:id' element={<Profile/>}/>
        <Route path='create-post' element={<CreatePost/>}/>
        <Route path='connections' element={<Connections/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App