import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

const Faucet = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-8">
        {isLoading ? (
          <div className=" p-10 rounded-xl shadow-lg w-full max-w-lg text-center flex flex-col gap-4">
            <Spinner />
          </div>
        ) : (
          <div className="bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-lg text-center flex flex-col gap-4">
            <h2 className="text-4xl font-bold text-yellow-400 mb-6">Faucet</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Enter your wallet address to receive test tokens.
            </p>

            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter Wallet Address"
              className="w-full p-4 rounded-lg bg-gray-700 text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <div className="flex flex-col md:flex-row gap-6 mt-8">
              <button
                className="bg-yellow-500 text-black py-4 px-8 rounded-full font-semibold w-full md:w-auto text-lg hover:bg-yellow-400 transition cursor-pointer"
                onClick={() => {
                  toast("Requesting EthToken");
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 3000);
                }}
                
              >
                Request EthToken
              </button>
              <button
                className="bg-blue-600 text-white py-4 px-8 rounded-full font-semibold w-full md:w-auto text-lg hover:bg-blue-500 transition"
                onClick={() => {
                  toast("Requesting PolToken");
                }}
              >
                Request PolToken
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Faucet;
