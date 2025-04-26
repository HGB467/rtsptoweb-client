import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import View from './components/View/View'

function App() {

  return (
    <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/view" element={<View/>} />
  </Routes>
  )
}

export default App
