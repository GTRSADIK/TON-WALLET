import { mnemonicNew, mnemonicToPrivateKey } from "ton-crypto";
import { TonClient, WalletContractV4 } from "ton";

const client = new TonClient({ endpoint: "https://toncenter.com/api/v2/jsonRPC" });

export async function generateWallet() {
  const mnemonic = await mnemonicNew();
  const keyPair = await mnemonicToPrivateKey(mnemonic);
  const wallet = WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 });
  return { mnemonic, address: wallet.address.toString() };
}

export async function checkBalance(address) {
  const balance = await client.getBalance(address);
  return balance.toString();
}

export async function transferTON(from, to, amount, seed) {
  // Transfer logic add korte hobe (simplified placeholder)
  return { status: "success", txHash: "demo_tx_hash" };
}