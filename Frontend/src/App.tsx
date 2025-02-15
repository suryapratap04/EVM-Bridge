import { Web3Provider } from "./Web3Provider";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import { Routes, Route } from "react-router-dom";
import Bridge from "./components/Bridge";
import MintToken from "./components/MintToken";
import ChangeOwner from "./components/ChangeOwner";
import EthereumBridgeConfig from "./components/EthereumBridgeConfig";
import PolygonBridgeConfig from "./components/PolygonBridgeConfig";

const App = () => {
  return (
    <Web3Provider>
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center">
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/bridge" element={<Bridge />} />
          <Route path="/mintToken" element={<MintToken />} />
          <Route path="/changeOwner" element={<ChangeOwner />} />
          <Route
            path="/ethereumBridgeConfig"
            element={<EthereumBridgeConfig />}
          />
          <Route
            path="/polygonBridgeConfig"
            element={<PolygonBridgeConfig />}
          />
        </Routes>
      </div>
    </Web3Provider>
  );
};

export default App;
