import { ConnectButton } from "@rainbow-me/rainbowkit";
import { walletL1OpStackActions } from "op-viem";
import { base } from "op-viem/chains";
import { mainnet } from "viem/chains";
import { createWalletClient, custom } from "viem";

import { useAccount } from "wagmi";
import abi from "./utils/mintableErc721";

const L2_NFT_CONTRACT_ADDRESS = "0x6171f829e107f70b58d67594c6b62a7d3eb7f23b"; // TODO, this is a random made up address

export function App() {
  const { isConnected, address } = useAccount();

  const opStackL1WalletClient =
    address &&
    createWalletClient({
      chain: mainnet,
      transport: custom(window.ethereum),
      account: address,
    }).extend(walletL1OpStackActions);

  const mint = async () => {
    if (!opStackL1WalletClient) return;

    opStackL1WalletClient.writeContractDeposit({
      abi,
      address: L2_NFT_CONTRACT_ADDRESS,
      functionName: "mint",
      l2Chain: base,
      account: address!,
      l2GasLimit: 1000000n,
    });
  };

  return (
    <>
      <h1>L1 &rarr; L2 Mint Example</h1>
      <p>
        Use <strong>op-viem</strong> <code>writeContractDeposit</code> to mint
        an OP L2 NFT from a mainnet transaction
      </p>
      <ConnectButton />
      {isConnected && (
        <>
          <button disabled={!opStackL1WalletClient} onClick={mint}>
            Mint
          </button>
        </>
      )}
    </>
  );
}
