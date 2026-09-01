import { Button } from '@heroui/react';
import { ThemeProvider } from './context/ThemeContext';
import { WallpaperProvider } from './context/WallpaperContext';
import ChatPage from './pages/styles/ChatPage';
import AuthPage from './pages/styles/AuthPage';
import { Navigate, Routes, Route } from 'react-router';
import { useAuth } from '@clerk/react';

function App() {

  const { isSignedIn, isLoaded } = useAuth();

   return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
          <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} replace />} />
          <Route
            path="/auth"
            element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace />}
          />
        </Routes>
      </WallpaperProvider>
    </ThemeProvider>
  );
}

export default App;