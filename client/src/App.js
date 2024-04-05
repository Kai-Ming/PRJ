import { BrowserRouter, Routes, Route} from 'react-router-dom'

import { useAuth } from "./authentication/useAuth"

import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import UpdateUser from './pages/UpdateUser'

function App() {
  const [isAuth, setAuth] = useAuth();

  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/register"
              element={<Register />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/user/upadate"
              element={<UpdateUser />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
