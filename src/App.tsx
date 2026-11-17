import { Header } from './components/Header';
import { TourHero } from './components/TourHero';
import { ExteriorReveal } from './components/ExteriorReveal';
import { Facts } from './components/Facts';
import { MobileBar } from './components/MobileBar';
import { SpacesStack } from './components/SpacesStack';
import { MaterialDetails } from './components/MaterialDetails';
import { Location } from './components/Location';
import { Terrace } from './components/Terrace';
import { DemoContact } from './components/DemoContact';
import { StudioCTA } from './components/StudioCTA';
import { Footer } from './components/Footer';
import { PlasterBackground } from './components/PlasterBackground';
import { useReveal } from './useReveal';

export default function App() {
  useReveal();

  return (
    <>
      <PlasterBackground />
      <a className="skip-link" href="#main">
        דילוג לתוכן הראשי
      </a>
      <div id="top" />
      <Header />
      <main id="main" tabIndex={-1}>
        <TourHero />
        <ExteriorReveal />
        <Facts />
        <SpacesStack />
        <MaterialDetails />
        <Terrace />
        <Location />
        <DemoContact />
        <StudioCTA />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
