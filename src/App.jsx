import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import { useUser } from '@clerk/react'
import { Layout } from 'lucide-react'

const App = () => {
  const {user}=useUser()
  return (
    <>
    <Routes>
      <Route path='/' element={!user ?<Login/>:<Layoutt />}>
        <Route index element={<Feed/>}/>
        <Route path='messages' element={<Messages/>}/>
        <Route path='messages/:id' element={<ChatBox/>}/>
        <Route path='discover' element={<Discover/>}/>
        <Route path='profile' element={<Profile/>}/>
        <Route path='profile/:id' element={<Profile/>}/>
        <Route path='create-post' element={<CreatePost/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App