import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Menu from './Menu'
import Dashboard from './Dashboard'
import Voters from './Voters'
import Proposals from './Proposals'

function Home() {
  return (
    <BrowserRouter>
        <Menu/>  
        <Routes>
        <Route path="/dashboard" element={<Dashboard/>}/>  
            <Route path="/voters" element={<Voters/>}/>  
            <Route path="/proposals" element={<Proposals/>}/>  
        </Routes>
    </BrowserRouter>
  )  
}

export default Home