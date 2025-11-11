import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import AdminLogin from "./components/Auth/LoginAdmin";

const App = () => {
  return (
    <div>
   <Routes>
    <Route path="/" element={<AdminLogin />} />
    <Route path="/dashboard" element={<Dashboard />} />
   </Routes>
    </div>
  )
}

export default App;