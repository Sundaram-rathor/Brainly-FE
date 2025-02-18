import Dashboard from "./component/pages/Dashboard"
import { SignIn } from "./component/pages/Signin"
import { Signup } from "./component/pages/Signup"
import {SharePage} from "./component/pages/SharePage"
import { BrowserRouter,Route,Routes } from "react-router-dom"



function App() {
  
  return (
    <>
    <BrowserRouter>
      <Routes>
          <Route path="/signin" element={<SignIn/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/api/v1/brain/:shareLink" element={<SharePage/>} />

      </Routes>
    </BrowserRouter>

    
    </>
  )
}

export default App