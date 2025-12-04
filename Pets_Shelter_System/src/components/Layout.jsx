import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

export default function Layout() {
  return (
     <>
      <Navbar />
      
    <div className="w-full pt-10 flex justify-center ">
  <div className="w-full max-w-[1400px]">
    <Outlet />
  </div>
</div>

        
      <Footer/>
    </>
  )
   
}
