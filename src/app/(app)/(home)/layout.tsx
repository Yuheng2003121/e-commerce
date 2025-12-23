import React, { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({children}: {children:ReactNode}) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar/>
      <div className='flex-1 bg-[#F4F4F0]'>
        {children}
      </div>
      <Footer/>
    </div>
  )
}
