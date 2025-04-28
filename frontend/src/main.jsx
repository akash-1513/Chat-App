import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import {BrowserRouter, createBrowserRouter, createRoutesFromElements, RouterProvider, Route, useParams} from 'react-router-dom'
import Home from './Home.jsx'
import About from './components/About/About.jsx'
import User, { githubInfoLoader } from './components/User/User.jsx'

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App/>,
//     children: [
//       {
//         path: '',
//         element: <Home />
//       },
//       {
//         path: "about",
//         element: <About />
//       }
//     ]
//   }
// ])

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = "/" element = {<App />}>
      <Route path = "" element = {<Home />} />
      <Route path = "about" element = {<About />} />
      <Route 
      loader={githubInfoLoader}
      path = "profile/:userid" element = {<User />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider>
      <RouterProvider router = {router} />
    </ChakraProvider>
  </StrictMode>,
)
