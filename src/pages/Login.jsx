import React from 'react'
import { assets } from '../assets/assets'
import { Star } from 'lucide-react'
import {SignIn} from '@clerk/react'
const Login = () => {
  return (
    <div className='relative min-h-screen flex flex-col md:flex-row'>
      
      {/* Background Image */}
      <img 
        src={assets.bgImage} 
        alt="Background" 
        className='absolute top-0 left-0 -z-10 w-full h-full object-cover'
      />

      {/* Left side: Branding */}
      <div className='flex-1 flex flex-col items-center justify-between p-6 md:p-10 lg:p-40'>
        
        <img src={assets.logo} alt="Branding" className='h-12 object-contain' />

        <div className='flex items-center gap-3 mb-4 max-md:mt-10'>
          <img src={assets.group_users} alt="" className='h-8 md:h-10' />
          
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className='size-4 md:size-4.5 fill-amber-500 text-amber-500' 
              />
            ))}
          </div>

          <p>Used by 1000+ users</p>
        </div>

        <h1 className='text-3xl md:text-6xl md:pb-2 font-bold bg-linear-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent'>
          Groove - Your Social Hub
        </h1>

        <p className='text-xl md:text-3xl text-indigo-900 max-w-[18rem] md:max-w-md text-center'>
          Connect with friends, share moments, and discover new experiences.
        </p>

      </div>
      <span className='md:h-10'></span>

      {/* Right side: Login Form */}
      <div className='flex-1 flex items-center justify-center p-6 sm:p-10'>
        <SignIn />
      </div>

    </div>
  )
}

export default Login