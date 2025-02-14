const Bridge = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-8">
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-lg text-center">
        <h2 className="text-4xl font-bold text-yellow-400 mb-6">Bridge</h2>
        <p className="text-gray-300 mb-8 text-lg">
          Select the networks and transfer your assets securely.
        </p>

        <div className="flex flex-col gap-6">
          <select className="w-full p-4 rounded-lg bg-gray-700 text-white text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
          </select>

          <select className="w-full p-4 rounded-lg bg-gray-700 text-white text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
            <option value="polygon">Polygon</option>
            <option value="ethereum">Ethereum</option>
          </select>
        </div>

        <div className="flex flex-col justify-center items-center md:flex-row gap-6 mt-8 w-full">
          <button className="bg-yellow-500 text-black py-4 px-8 rounded-full font-semibold w-full border-2 border-white text-lg hover:bg-yellow-400 transition">
            Approve and Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bridge;
