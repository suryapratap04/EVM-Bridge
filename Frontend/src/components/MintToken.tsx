import { useEffect, useState } from "react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { EthTokenAbi } from "../Abi/EthToken";
import Spinner from "./Spinner";
import toast from "react-hot-toast";

const wagmiContractConfig = {
  address: "0x8fa741639BCB1Eb73833Fb4C3559FD7f495f3Ca8",
  abi: EthTokenAbi,
} as const;

export default function MintAndCheckBalance() {
  const account = useAccount();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const { data: balanceData, refetch } = useReadContract({
    ...wagmiContractConfig,
    functionName: "balanceOf",
    args: [address],
  });

  const { writeContractAsync } = useWriteContract();
  const handleMint = async () => {
    if (!address || !amount) {
      setError("Address and amount are required");
      return;
    }

    setError(null);
    setIsLoading(true);
    setTransactionHash(null);

    try {
      const tx = await writeContractAsync({
        ...wagmiContractConfig,
        functionName: "mint",
        args: [address, BigInt(Number(amount))],
      });

      setTransactionHash(tx);
      toast("Transaction sent,View on Explorer");
    } catch (err: any) {
      setError(err.message);
      console.log("Error came  on Minting", err);
      toast.error("Transaction error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (account.address) {
      setAddress(account.address);
    }
  }, [account.address]);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-8">
      {isLoading ? (
        <div className="p-10 rounded-xl shadow-lg w-full max-w-lg text-center flex flex-col gap-4">
          <Spinner />
        </div>
      ) : (
        <div className="bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-lg text-center">
          <h2 className="text-4xl font-bold text-yellow-400 mb-6">
            Mint Tokens
          </h2>
          {!address && (
            <p className="text-red-500   mb-4 text-lg ">
              Please connect your wallet to mint tokens.
            </p>
          )}
          <p className="text-gray-300 mb-4 text-lg">
            Enter wallet address and amount to mint.
          </p>

          <input
            type="text"
            placeholder="Wallet Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-4 mb-4 rounded-lg bg-gray-700 text-white text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="number"
            placeholder="Amount to Mint"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-4 mb-4 rounded-lg bg-gray-700 text-white text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            onClick={handleMint}
            disabled={!address || !amount || isLoading}
            className="bg-yellow-500 text-black py-4 px-8 rounded-full font-semibold w-full text-lg hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? "Minting..." : "Mint Token"}
          </button>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {transactionHash && (
            <div className="mt-4">
              <p className="text-green-400">Transaction Sent!</p>
              <a
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                View on Explorer
              </a>
            </div>
          )}

          <h3 className="text-3xl font-bold text-yellow-400 mt-8">
            Check Balance
          </h3>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white py-4 px-8 rounded-full font-semibold w-full mt-4 text-lg hover:bg-blue-500 transition cursor-pointer"
          >
            Refresh Balance
          </button>
          <p className="text-gray-300 mt-4 text-lg">
            Balance: {balanceData?.toString() || "0"}
          </p>
        </div>
      )}
    </div>
  );
}
