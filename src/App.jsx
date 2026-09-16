import { useState } from 'react'
import { VehicleCatalogProvider } from './context/VehicleCatalogContext.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import SmartSearchPanel from './components/SmartSearchPanel.jsx'
import CollectorShowcase from './components/CollectorShowcase.jsx'
import FeaturedVehicles from './components/FeaturedVehicles.jsx'
import VehicleGrid from './components/VehicleGrid.jsx'
import VehicleDetailPage from './components/VehicleDetailPage.jsx'
import Comparator from './components/Comparator.jsx'
import Services from './components/Services.jsx'
import CtaBanner from './components/CtaBanner.jsx'
import ChatDrawer from './components/ChatDrawer.jsx'
import PremiumBookingModal from './components/PremiumBookingModal.jsx'
import Footer from './components/Footer.jsx'
import PageBackground from './components/effects/PageBackground.jsx'
import './App.css'

function App() {
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [advisorMode, setAdvisorMode] = useState(null)
  const [bookingOpen, setBookingOpen] = useState(false)

  return (
    <VehicleCatalogProvider>
      <PageBackground />
      <Navbar />
      <main>
        <Hero />
        <SmartSearchPanel />
        <CollectorShowcase onOpenVehicle={setSelectedVehicle} />
        <FeaturedVehicles onOpenVehicle={setSelectedVehicle} />
        <VehicleGrid onOpenVehicle={setSelectedVehicle} />
        <Comparator />
        <Services />
        <CtaBanner onOpenChat={() => setChatOpen(true)} onOpenBooking={() => setBookingOpen(true)} />
      </main>
      <Footer />

      <VehicleDetailPage
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        advisorMode={advisorMode}
        onActivateAdvisor={() => setAdvisorMode(true)}
        onOpenChat={() => setChatOpen(true)}
        onOpenBooking={() => setBookingOpen(true)}
      />
      <PremiumBookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        prefillVehicle={selectedVehicle}
      />
      <ChatDrawer
        currentVehicle={selectedVehicle}
        open={chatOpen}
        onOpenChange={setChatOpen}
        advisorMode={advisorMode}
        onAdvisorChange={setAdvisorMode}
      />
    </VehicleCatalogProvider>
  )
}

export default App
