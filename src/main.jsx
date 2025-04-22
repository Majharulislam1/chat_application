import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Join from './Components/Join.jsx'
import Chat from './Components/Chat.jsx';
 

const router = createBrowserRouter([
  {
    path: "/",
    element: <Join></Join>,
  },
  {
    path:'/chat',
    element:<Chat></Chat>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
