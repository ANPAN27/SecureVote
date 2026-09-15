import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppProvider } from './context/AppContext'
import BlockchainField from './components/BlockchainField'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ToastStack from './components/ToastStack'

import Landing from './pages/Landing'
import Auth from './pages/Auth'
import VoterDashboard from './pages/VoterDashboard'
import Vote from './pages/Vote'
import Receipt from './pages/Receipt'
import Admin from './pages/Admin'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <BlockchainField />
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/voter" element={<VoterDashboard />} />
            <Route path="/vote" element={<Vote />} />
            <Route path="/receipt" element={<Receipt />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </AnimatePresence>
        <Footer />
        <ToastStack />
        <ScrollToTop />
      </BrowserRouter>
    </AppProvider>
  )
}