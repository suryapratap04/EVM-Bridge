import { useState } from "react";
import { useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import { PolBridgeAbi } from "../Abi/PolBridge";

const contractConfig = {
  address: "0x919b7Ed5c5018185322CF8859DB92d4E83d66dF4",
  abi: PolBridgeAbi,
} as const;

export default function PolygonBridgeConfig() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [remoteAddress, setRemoteAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const handleUpdateEndpoint = async () => {
    if (!tokenAddress || !remoteAddress) {
      toast.error("Please enter valid addresses");
      return;
    }

    setIsLoading(true);
    try {
      const tx = await writeContractAsync({
        ...contractConfig,
        functionName: "changeEndpoint",
        args: [tokenAddress, 10161, remoteAddress],
        chainId: 80002,
      });

      toast.success("Polygon Bridge updated: " + tx);
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
        placeholder="Token Address"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white"
      />
      <input
        type="text"
        placeholder="Ethereum Bridge Address"
        value={remoteAddress}
        onChange={(e) => setRemoteAddress(e.target.value)}
        className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white"
      />
      <button
        onClick={handleUpdateEndpoint}
        disabled={!tokenAddress || !remoteAddress || isLoading}
        className="bg-yellow-500 text-black py-3 px-6 rounded-full w-full hover:bg-yellow-400 transition disabled:opacity-50"
      >
        {isLoading ? "Updating..." : "Update Polygon Bridge"}
      </button>
    </div>
  );
}
