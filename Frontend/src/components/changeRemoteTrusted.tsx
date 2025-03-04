import { useState } from "react";
import {
  useWriteContract,
  useAccount,
  useSwitchChain,
  useReadContract,
} from "wagmi";
import toast from "react-hot-toast";
import { PolBridgeAbi } from "../Abi/PolBridge";
import { EthBridgeAbi } from "../Abi/EthBridge";

const EBRIDGE_CONFIG = {
  address: "0xE788cD5C7F5F020E42714b16AADf256B12701b39", // Sepolia EBridge
  abi: EthBridgeAbi,
} as const;

const PBRIDGE_CONFIG = {
  address: "0x26c521118e7EF2Ee9009fbE7ba4D2BEdAB97B3fD", // Amoy PBridge
  abi: PolBridgeAbi,
} as const;

const SEPOLIA_CHAIN_ID = 11155111; // Ethereum Sepolia (EVM chain ID)
const AMOY_CHAIN_ID = 80002; // Polygon Amoy (EVM chain ID)
const LZ_SEPOLIA_CHAIN_ID = 10161; // LayerZero Sepolia chain ID
const LZ_AMOY_CHAIN_ID = 10267; // LayerZero Amoy chain ID

// Trusted remote paths: Concatenation of remote address + local address
const PATH_TO_AMOY = `0x26c521118e7EF2Ee9009fbE7ba4D2BEdAB97B3fD${EBRIDGE_CONFIG.address.slice(
  2
)}`;
const PATH_TO_SEPOLIA = `0xE788cD5C7F5F020E42714b16AADf256B12701b39${PBRIDGE_CONFIG.address.slice(
  2
)}`;

export default function ChangeRemoteTrusted() {
  const [network, setNetwork] = useState("sepolia");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const { chain, address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  // Fetch contract owners and trusted remote data
  const { data: pBridgeOwner } = useReadContract({
    ...PBRIDGE_CONFIG,
    functionName: "owner",
    chainId: AMOY_CHAIN_ID,
  });

  const { data: eBridgeOwner } = useReadContract({
    ...EBRIDGE_CONFIG,
    functionName: "owner",
    chainId: SEPOLIA_CHAIN_ID,
  });

  const { data: trustedRemoteAmoy } = useReadContract({
    ...PBRIDGE_CONFIG,
    functionName: "trustedRemoteLookup",
    args: [LZ_SEPOLIA_CHAIN_ID], // Check Sepolia trusted remote on Amoy
  });

  const { data: trustedRemoteSepolia } = useReadContract({
    ...EBRIDGE_CONFIG,
    functionName: "trustedRemoteLookup",
    args: [LZ_AMOY_CHAIN_ID], // Check Amoy trusted remote on Sepolia
  });

  const handleSetTrustedRemote = async () => {
    try {
      setIsLoading(true);

      const targetChainId =
        network === "sepolia" ? SEPOLIA_CHAIN_ID : AMOY_CHAIN_ID;
      const contractConfig =
        network === "sepolia" ? EBRIDGE_CONFIG : PBRIDGE_CONFIG;
      const remoteChainId =
        network === "sepolia" ? LZ_AMOY_CHAIN_ID : LZ_SEPOLIA_CHAIN_ID;
      const path = network === "sepolia" ? PATH_TO_AMOY : PATH_TO_SEPOLIA;
      const owner = network === "sepolia" ? eBridgeOwner : pBridgeOwner;

      // Check if connected address is the owner
      if (
        address?.toLowerCase() !== owner?.toLowerCase() &&
        owner !== undefined
      ) {
        toast.error(`Only the owner (${owner}) can set trusted remotes!`);
        return;
      }

      // Check if trusted remote is already set
      const currentTrustedRemote =
        network === "sepolia" ? trustedRemoteSepolia : trustedRemoteAmoy;
      if (currentTrustedRemote && currentTrustedRemote !== "0x") {
        toast.error(`Trusted remote already set for chain ${remoteChainId}!`);
        return;
      }

      // Switch to the correct chain if needed
      if (chain?.id !== targetChainId) {
        toast("Switching network...");
        await switchChainAsync({ chainId: targetChainId });
      }

      // Execute the contract call
      const tx = await writeContractAsync({
        ...contractConfig,
        functionName: "setTrustRemote", // Correct function name from your contract
        args: [remoteChainId, path],
        gas: BigInt(300000), // Gas limit for the transaction
      });

      toast.success("Trusted remote set!");
      setTransactionHash(tx);
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error(`Transaction failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">
        Set Trusted Remote
      </h2>
      <select
        value={network}
        onChange={(e) => setNetwork(e.target.value)}
        className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        <option value="sepolia">Ethereum Sepolia (EBridge)</option>
        <option value="amoy">Polygon Amoy (PBridge)</option>
      </select>
      <button
        onClick={handleSetTrustedRemote}
        disabled={isLoading}
        className="cursor-pointer bg-yellow-500 text-black py-3 px-6 rounded-full font-semibold w-full hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : "Set Trusted Remote"}
      </button>
      {transactionHash && (
        <div className="mt-4">
          <p className="text-sm text-gray-400">
            Transaction Hash:{" "}
            <a
              href={
                network === "sepolia"
                  ? `https://sepolia.etherscan.io/tx/${transactionHash}`
                  : `https://amoy.polygonscan.com/tx/${transactionHash}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 underline"
            >
              View on {network === "sepolia" ? "Etherscan" : "Polygonscan"}
            </a>
          </p>
        </div>
      )}
      {pBridgeOwner && (
        <p className="text-sm text-gray-400 mt-2">
          PBridge Owner: {pBridgeOwner}
        </p>
      )}
      {eBridgeOwner && (
        <p className="text-sm text-gray-400 mt-2">
          EBridge Owner: {eBridgeOwner}
        </p>
      )}
      {trustedRemoteAmoy && (
        <p className="text-sm text-gray-400 mt-2">
          PBridge Trusted Remote (Sepolia): {trustedRemoteAmoy}
        </p>
      )}
      {trustedRemoteSepolia && (
        <p className="text-sm text-gray-400 mt-2">
          EBridge Trusted Remote (Amoy): {trustedRemoteSepolia}
        </p>
      )}
    </div>
  );
}
