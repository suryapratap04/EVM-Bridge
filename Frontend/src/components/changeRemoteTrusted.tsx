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
  address: "0xDb419a67652F9985767BA7D9D7C96dEDA7A14E5c",
  abi: EthBridgeAbi,
} as const;

const PBRIDGE_CONFIG = {
  address: "0x6459C29749D6D85124d9d232Fe3d09fFf70267E9",
  abi: PolBridgeAbi,
} as const;

const SEPOLIA_CHAIN_ID = 11155111;
const AMOY_CHAIN_ID = 80002;

const PATH_TO_AMOY =
  "0x6459C29749D6D85124d9d232Fe3d09fFf70267E9Db419a67652F9985767BA7D9D7C96dEDA7A14E5c";
const PATH_TO_SEPOLIA =
  "0xDb419a67652F9985767BA7D9D7C96dEDA7A14E5c6459C29749D6D85124d9d232Fe3d09fFf70267E9";

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
    args: [40161],
  });

  const handleSetTrustedRemote = async () => {
    try {
      setIsLoading(true);

      const targetChainId =
        network === "sepolia" ? SEPOLIA_CHAIN_ID : AMOY_CHAIN_ID;
      const contractConfig =
        network === "sepolia" ? EBRIDGE_CONFIG : PBRIDGE_CONFIG;
      const remoteChainId = network === "sepolia" ? 40267 : 40161;
      const path = network === "sepolia" ? PATH_TO_AMOY : PATH_TO_SEPOLIA;
      const owner = network === "sepolia" ? eBridgeOwner : pBridgeOwner;

      console.log("Connected address:", address);
      console.log("PBridge Owner:", pBridgeOwner);
      console.log("EBridge Owner:", eBridgeOwner);
      console.log("Trusted Remote for 40161:", trustedRemoteAmoy);

      // Ensure owner is available
      // if (!owner) {
      //   toast.error("Failed to fetch owner. Check network or ABI.");
      //   return;
      // }

      // if (address?.toLowerCase() !== owner?.toLowerCase()) {
      //   toast.error(`Only the owner (${owner}) can set trusted remotes!`);
      //   return;
      // }

      // Check if trusted remote is already set
      if (trustedRemoteAmoy && trustedRemoteAmoy !== "0x") {
        toast.error("Trusted remote already set for chain 40161!");
        return;
      }

      if (chain?.id !== targetChainId) {
        toast("Switching network...");
        await switchChainAsync({ chainId: targetChainId });
      }

      const tx = await writeContractAsync({
        ...contractConfig,
        functionName: "setTrustedRemote",
        args: [remoteChainId, path],
        gas: BigInt(300000),
      });

      toast.success("Trusted remote set!");
      setTransactionHash(tx);
    } catch (error: any) {
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
          Trusted Remote (40161): {trustedRemoteAmoy}
        </p>
      )}
    </div>
  );
}
