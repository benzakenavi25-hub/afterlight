import { Header } from './components/Header';
import { TourHero } from './components/TourHero';
import { HomeOverview } from './components/HomeOverview';
import { SpacesGallery } from './components/SpacesGallery';
import { ConceptPlan } from './components/ConceptPlan';
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
        <HomeOverview />
        <SpacesGallery />
        <ConceptPlan />
        <MaterialDetails />
        <Terrace />
        <DemoContact />
      </main>
      <Footer />
    </>
  );
}
