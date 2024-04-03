import { BrowserRouter, Routes, Route} from 'react-router-dom'

import Home from './pages/Home'
import Register from './pages/RegisterUser'

function App() {
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
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
