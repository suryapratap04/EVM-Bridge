import { useState } from "react";
import { useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import { getAddress } from "viem";
import { EthBridgeAbi } from "../Abi/EthBridge";

const contractConfig = {
  address: "0xDb419a67652F9985767BA7D9D7C96dEDA7A14E5c", // Replace with the Ethereum Bridge contract address
  abi: EthBridgeAbi,
} as const;

export default function SetPBridge() {
  const [pBridge, setPBridge] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const handleSetPBridge = async () => {
    if (!pBridge) {
      toast.error("Please enter a valid Polygon Bridge address");
      return;
    }

    try {
      setIsLoading(true);
      const formattedAddress = getAddress(pBridge); // Ensure valid Ethereum address

      const tx = await writeContractAsync({
        ...contractConfig,
        functionName: "setPBridge",
        args: [formattedAddress],
      });

      toast.success("Polygon Bridge address updated! TX: " + tx);
      console.log("Transaction:", tx);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">
        Update Polygon Bridge
      </h2>
      <input
        type="text"
        placeholder="New Polygon Bridge Address"
        value={pBridge}
        onChange={(e) => setPBridge(e.target.value)}
        className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <button
        onClick={handleSetPBridge}
        disabled={!pBridge || isLoading}
        className="cursor-pointer bg-yellow-500 text-black py-3 px-6 rounded-full font-semibold w-full hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Updating..." : "Set PBridge"}
      </button>
    </div>
  );
}
