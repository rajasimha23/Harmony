import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/Login'
import Register from './pages/Register'
import Logout from './pages/Logout'
import Home from './pages/Home'
import Header from "./components/Header"
import DummyHeader from "./components/DummyHeader"
import CreateChatroom from "./pages/CreateChatroom"
import ManageChatrooms from "./pages/ManageChatrooms"
import Chatroom from "./pages/Chatroom"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<><Header /><Login /></>} />
          <Route path='/home' element={<><Header /><Home /></>} />
          <Route path='/login' element={<><DummyHeader /><Login /></>} />
          <Route path='/register' element={<><DummyHeader /><Register /></>} />
          <Route path='/logout' element={<><Header /><Logout /></>} />
          <Route path='/createChatroom' element={<><Header /><CreateChatroom /></>} />
          <Route path='/manage' element={<><Header /><ManageChatrooms /></>} />
          <Route path="/chatroom/:chatroomId" element={<><Header /><Chatroom /></>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
