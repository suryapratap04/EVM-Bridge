import { useState } from "react";

export default function Token() {
  const [address, setAddress] = useState("");
  return (
    <div className="border-2 border-black flex flex-col justify-evenly items-center max-w-[1000px] w-[100%] h-[120px]">
      <h1 className="text-xl font-bold">Token Faucet for testing</h1>
      <div className="flex  flex-wrap justify-evenly items-center  w-[100%]">
        <input
          type="text"
          placeholder="Enter your wallet address"
          className="border-2 border-black p-2 rounded-md w-[50%]"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          className="border-2 border-black p-2 rounded-md min-w-[100px]"
          onClick={() => {
            console.log("Minting Token to the Address");
            console.log(address);
          }}
        >
          Mint(5)
        </button>
      </div>
    </div>
  );
}
