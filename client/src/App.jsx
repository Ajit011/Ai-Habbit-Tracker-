import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function App() {
  // Check karte hain ki user ke paas login token hai ya nahi
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
        <Routes>
          {/* Agar user logged in nahi hai toh Auth page dikhao, nahi toh direct Dashboard bhej do */}
          <Route path="/auth" element={!isAuthenticated ? <Auth /> : <Navigate to="/dashboard" />} />
          
          {/* Protected Route: Logged in user hi Dashboard dekh sakta hai */}
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} />
          
          {/* Agar koi galat URL daale toh automatic sahi page par redirect karo */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;