import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { mainnet, base } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const walletConnectProjectId = "898f836c53a18d0661340823973f0cb4";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, base],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        const urls = {
          1: {
            http: import.meta.env.VITE_RPC_URL_1 ?? "https://eth.llamarpc.com",
          },

          8453: {
            http:
              import.meta.env.VITE_RPC_URL_8453 ?? "https://mainnet.base.org",
          },
        };
        return [1, 8453].includes(chain.id) ? urls[chain.id as 1 | 8453] : null;
      },
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My wagmi + RainbowKit App",
  chains,
  projectId: walletConnectProjectId,
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };
