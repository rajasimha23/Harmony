import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/Login'
import Register from './pages/Register'
import Logout from './pages/Logout'
import Home from './pages/Home'
import Header from "./components/headers/Header"
import ManageChatrooms from "./pages/ManageChatrooms"
import Chatroom from "./pages/Chatroom"
import AddHeader from "./components/headers/AddHeader"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<><Login /></>} />
          <Route path='/home' element={<><Home /></>} />
          <Route path='/login' element={<><Login /></>} />
          <Route path='/register' element={<><Register /></>} />
          <Route path='/logout' element={<><Header /><Logout /></>} />
          <Route path='/manage' element={<><Header /><ManageChatrooms /></>} />
          <Route path="/chatroom/:chatroomId" element={<><Header/><Chatroom /></>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
