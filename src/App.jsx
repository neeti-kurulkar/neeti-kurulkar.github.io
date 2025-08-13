// src/App.jsx
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import WorkExperience from './components/WorkExperience';
import Projects from './components/Projects';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <WorkExperience />
      <Projects />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;