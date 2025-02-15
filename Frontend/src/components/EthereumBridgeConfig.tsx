import { useState } from "react";
import { useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import { EthBridgeAbi } from "../Abi/EthBridge"; // Import correct ABI

const contractConfig = {
  address: "0x0B3Fd3Cae31289Ce6FC4dFE4F78253b6FbC03F3A", // Replace with Ethereum Bridge address
  abi: EthBridgeAbi,
} as const;

export default function EthereumBridgeConfig() {
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
        args: [tokenAddress, 10160, remoteAddress], // 10160 = Polygon Amoy
      });

      toast.success("Ethereum Bridge updated: " + tx);
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
        Update Ethereum Bridge
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
        placeholder="Polygon Bridge Address"
        value={remoteAddress}
        onChange={(e) => setRemoteAddress(e.target.value)}
        className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white"
      />
      <button
        onClick={handleUpdateEndpoint}
        disabled={!tokenAddress || !remoteAddress || isLoading}
        className="bg-yellow-500 text-black py-3 px-6 rounded-full w-full hover:bg-yellow-400 transition disabled:opacity-50"
      >
        {isLoading ? "Updating..." : "Update Ethereum Bridge"}
      </button>
    </div>
  );
}
