const Faucet = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-8">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">Faucet</h2>
        <p className="text-gray-300 mb-6">
          Enter your wallet address to receive test tokens.
        </p>

        <input
          type="text"
          placeholder="Enter Wallet Address"
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <button className="bg-yellow-500 text-black py-3 px-6 rounded-full font-semibold w-full md:w-auto hover:bg-yellow-400 transition">
            Request EthToken
          </button>
          <button className="bg-blue-600 text-white py-3 px-6 rounded-full font-semibold w-full md:w-auto hover:bg-blue-500 transition">
            Request PolToken
          </button>
        </div>
      </div>
    </div>
  );
};

export default Faucet;
