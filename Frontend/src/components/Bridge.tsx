import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { EthBridgeAbi } from "../Abi/EthBridge";
import { EthTokenAbi } from "../Abi/EthToken";

const wagmiContractConfig = {
  address: "0x3fB3712731367F3ab9503dcD06eFd024E7c72642",
  abi: EthTokenAbi,
} as const;

const wagmiContractConfigEthBridge = {
  address: "0xDb419a67652F9985767BA7D9D7C96dEDA7A14E5c",
  abi: EthBridgeAbi,
} as const;

export default function Bridge() {
  const account = useAccount();
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [txHashApprove, setTxHashApprove] = useState<string | null>(null);
  const [txHashBridge, setTxHashBridge] = useState<string | null>(null);

  const { data: balanceData, refetch } = useReadContract({
    ...wagmiContractConfig,
    functionName: "balanceOf",
    args: [address],
  });
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    if (balanceData) {
      setBalance(balanceData.toString());
    }
  }, [balanceData]);
  useEffect(() => {
    if (account.address) {
      setAddress(account.address);
    }
  }, [account.address]);

  const handleBridge = async () => {
    if (!amount || address == null) {
      toast.error("Please enter Valid Amount or connect your wallet");
      return;
    }

    // Approve the EthBridge contract to spend the tokens
    const approveAmount = BigInt(Number(amount));
    const txHashApprove = await writeContractAsync({
      ...wagmiContractConfig,
      functionName: "approve",
      args: [wagmiContractConfigEthBridge.address, approveAmount],
    });

    toast("Approved Successfully");
    setTxHashApprove(txHashApprove);

    const txHashBridge = await writeContractAsync({
      ...wagmiContractConfigEthBridge,
      functionName: "lock",
      args: [40267, approveAmount],
    });

    toast("Bridge Successfully Check Explorer");
    setTxHashBridge(txHashBridge);
    try {
    } catch (error) {
      console.error(error);
      toast.error("Bridge failed");
      setAmount("");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-8">
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-lg text-center">
        <h2 className="text-4xl font-bold text-yellow-400 mb-6">Bridge</h2>
        <p className="text-gray-300 mb-8 text-lg">
          Select the networks and transfer your assets securely.
        </p>

        {address ? (
          <div className="flex flex-col gap-6">
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white py-4 px-8 rounded-full font-semibold w-full mt-4 text-lg hover:bg-blue-500 transition cursor-pointer"
            >
              Refresh Balance
            </button>
            <p className="text-gray-300 mb-8 text-lg">
              Your Eth Balance is : {balance ? balance?.toString() : "0"}
            </p>
          </div>
        ) : (
          <p className="text-red-500 mb-8 text-lg">
            Please connect your wallet to continue
          </p>
        )}

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

        <div className="flex flex-col gap-6 mt-6">
          <input
            type="number"
            placeholder="Amount"
            className="w-full p-4 rounded-lg bg-gray-700 text-white text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="flex flex-col justify-center items-center md:flex-row gap-6 mt-8 w-full">
          <button
            className="bg-yellow-500 text-black py-4 px-8 rounded-full font-semibold w-full border-2 border-white text-lg hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            disabled={!amount || !address}
            onClick={handleBridge}
          >
            Approve and Send
          </button>
        </div>
        <div className="flex flex-col gap-6 mt-6">
          {txHashApprove && (
            <>
              <p className="text-gray-300 mb-1 text-lg">Approve Transaction</p>
              <a
                href={`https://sepolia.etherscan.io/tx/${txHashApprove}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                View on Explorer
              </a>
            </>
          )}
          {txHashBridge && (
            <>
              <p className="text-gray-300 mb-1 text-lg">Bridge Transaction</p>
              <a
                href={`https://sepolia.etherscan.io/tx/${txHashBridge}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                View on Explorer
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
