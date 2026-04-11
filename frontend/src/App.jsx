import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen relative">
      {/* Background radial gradient decoration */}
      <div className="fixed inset-0 bg-[#0A0F1F] z-[-1]"/>
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl z-[-1]"/>
      <div className="fixed top-1/2 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl z-[-1]"/>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;