import { WagmiProvider, createConfig, http } from "wagmi";
import { polygonAmoy, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    // chains: [mainnet],
    chains: [sepolia, polygonAmoy],
    transports: {
      [sepolia.id]: http(
        `https://eth-sepolia.g.alchemy.com/v2/xPlxL0z8E8lRb0kKYEQKGZkKhB-7PNrI`
      ),
      [polygonAmoy.id]: http(
        "https://polygon-amoy.g.alchemy.com/v2/J2GJtIZ8WX5q0QVZszBd712QRQQhSG_4"
      ),
    },

    // Required API Keys
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,

    // Required App Info
    appName: "Your App Name",

    // Optional App Info
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
