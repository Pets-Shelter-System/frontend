import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

export default function Layout() {
  return (
    <>
      <Navbar />

      <div className="container w-full pt-[65px] min-h-screen">

        <Outlet />

      </div>
      <Footer />
    </>
  )

}
