import { Web3Provider } from "./Web3Provider";
import Navbar from "./components/Navbar";
import Bridge from "./components/Bridge";
import Token from "./components/Token";
const App = () => {
  return (
    <Web3Provider>
      <div className="min-h-[100vh] min-w-[100vw] h-[100%] w-[100%] border-black border-2 flex flex-col items-center pt-4">
        <Navbar />
        <Token />
        <Bridge />
      </div>
    </Web3Provider>
  );
};

export default App;
