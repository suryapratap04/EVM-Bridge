const HeroSection = () => {
  return (
    <div className="relative h-[80vh] text-center flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 md:p-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400">
        Seamless Bridging Across EVM Chains
      </h1>
      <p className="text-lg mt-4 text-gray-300 max-w-2xl">
        A decentralized bridge ensuring fast and secure asset transfers across
        multiple EVM-compatible networks.
      </p>
      <div className="mt-6 flex flex-col md:flex-row gap-4 md:gap-6">
        <a
          href="/faucet"
          className="bg-yellow-500 text-black py-3 px-6 rounded-full text-lg font-semibold hover:bg-yellow-400 transition"
        >
          Faucet Token
        </a>
        <a
          href="/bridge"
          className="bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-blue-500 transition"
        >
          Go to Bridge
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
