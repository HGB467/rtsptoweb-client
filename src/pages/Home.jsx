import React from 'react'
import TopBar from '../components/Home/TopBar'
import Streams from '../components/Home/Streams'
import { Toaster } from 'react-hot-toast'

const Home = () => {
  return (
    <div>
    <Toaster position='top-center'/>

    <TopBar/>
    <Streams/>
    </div>
  )
}

export default Home