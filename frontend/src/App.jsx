import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatBox from './components/ChatBox'
import Community from './pages/Community'
import Login from './pages/Login'
import Credits from './pages/Credits'
import { Route,Routes, useLocation } from 'react-router-dom'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import { useAppcontext } from './context/AppContext'

const App = () => {
  const {user}=useAppcontext();
    const [isMenu,SetisMenu]=useState(false);
    const {pathname}=useLocation();
    // console.log(pathname);
    if(pathname==='/location')return <Loading/>
  return (
    <>
  {
    !isMenu && <img src={assets.menu_icon} className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert' onClick={()=>SetisMenu(true)}/>
  }
  {user?(    <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000]  dark:text-white'>
      <div className='flex h-screen w-screen'>
        {pathname !== "/loading" && <Sidebar isMenu={isMenu} SetisMenu={SetisMenu}/>}
        <Routes>
          <Route path="/" element={<ChatBox/>}/>
          <Route path="/credits" element={<Credits/>}/>
          <Route path="/community" element={<Community/>}/>
          <Route path="/loading" element={<Loading/>}/>

          
        </Routes>
      </div>
    </div>):(<div className='bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen'><Login/></div>)}

    </>
  )
}

export default App