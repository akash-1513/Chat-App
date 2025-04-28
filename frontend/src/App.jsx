import { useState } from 'react'
import './App.css'
import { Button, Text } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header'


function App() {

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default App
