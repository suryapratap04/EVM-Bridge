import { Web3Provider } from "./Web3Provider";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import { Routes, Route } from "react-router-dom";
import Faucet from "./components/Faucet";


const App = () => {
  return (
    <Web3Provider>
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center">
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/faucet" element={<Faucet />} />
        </Routes>
      </div>
    </Web3Provider>
  );
};

export default App;
