import { ConnectKitButton } from "connectkit";

export default function Navbar() {
  return (
    <div className="w-[100%] bg-gray-800 flex justify-center items-center">
      <nav className="max-w-[1000px] w-[100%]  text-white p-4 flex justify-between items-center shadow-lg ">
        <h1 className="text-2xl font-bold text-yellow-400 text-center">EVM Bridge</h1>
        <button className=" text-black py-2 px-4 rounded-full font-semibold hover:bg-yellow-400 transition">
          <ConnectKitButton />
        </button>
      </nav>
    </div>
  );
}
