import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Signup from "./pages/Signup"
import { ToastContainer } from "react-toastify"

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App