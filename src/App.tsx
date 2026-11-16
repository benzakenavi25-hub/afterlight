import { Header } from './components/Header';
import { TourHero } from './components/TourHero';
import { ExteriorReveal } from './components/ExteriorReveal';
import { SpacesStack } from './components/SpacesStack';
import { MaterialDetails } from './components/MaterialDetails';
import { Terrace } from './components/Terrace';
import { DemoContact } from './components/DemoContact';
import { Footer } from './components/Footer';
import { ElevatorDoors } from './components/ElevatorDoors';
import { useReveal } from './useReveal';

export default function App() {
  useReveal();

  return (
    <>
      <ElevatorDoors />
      <a className="skip-link" href="#main">
        דילוג לתוכן הראשי
      </a>
      <div id="top" />
      <Header />
      <main id="main" tabIndex={-1}>
        <TourHero />
        <ExteriorReveal />
        <SpacesStack />
        <MaterialDetails />
        <Terrace />
        <DemoContact />
      </main>
      <Footer />
    </>
  );
}
