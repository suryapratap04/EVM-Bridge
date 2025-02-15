import { useState } from "react";
import { useWriteContract, useAccount, useSwitchChain } from "wagmi";
import toast from "react-hot-toast";
import { PolTokenAbi } from "../Abi/PolToken";

const contractConfig = {
  address: "0x2854c61632b1b6B0F0EE47C7c0cdE5a6e7eBdB77",
  abi: PolTokenAbi,
} as const;

export default function ChangeMintOwner() {
  const [newOwner, setNewOwner] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const handleChangeMintOwner = async () => {
    if (!newOwner) {
      toast.error("Please enter a valid address");
      return;
    }

    try {
      setIsLoading(true);

      // Ensure the wallet is on Polygon Amoy (80002)
      if (chain?.id !== 80002) {
        toast("Switching to Polygon Amoy...");
        await switchChainAsync({ chainId: 80002 });
      }

      // Execute the contract function
      const tx = await writeContractAsync({
        ...contractConfig,
        functionName: "changeMintOwner",
        args: [newOwner],
      });

      toast.success("Transaction sent!");
      console.log("Transaction sent:", tx);
      setTransactionHash(tx);
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
        Change Mint Owner
      </h2>
      <input
        type="text"
        placeholder="New Mint Owner Address"
        value={newOwner}
        onChange={(e) => setNewOwner(e.target.value)}
        className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <button
        onClick={handleChangeMintOwner}
        disabled={!newOwner || isLoading}
        className="cursor-pointer bg-yellow-500 text-black py-3 px-6 rounded-full font-semibold w-full hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : "Change Owner"}
      </button>
      {transactionHash && (
        <div className="mt-4">
          <p className="text-sm text-gray-400">
            Transaction Hash:{" "}
            <a
              href={`https://amoy.polygonscan.com/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 underline"
            >
              View on Polygonscan
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
