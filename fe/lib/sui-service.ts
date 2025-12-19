// /music-store/fe/lib/sui-service.ts
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { WalletAccount } from '@mysten/wallet-standard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const PACKAGE_ID = process.env.NEXT_PUBLIC_SUI_PACKAGE_ID || '';
const PLATFORM_ID = process.env.NEXT_PUBLIC_SUI_PLATFORM_ID || '';

export const suiClient = new SuiClient({
  url: 'https://sui-testnet.publicnode.com'  
});

// Tier prices in MIST
export const TIER_PRICES = {
  free: 0n,
  premium: 1_000_000_000n, // 1 SUI
  vip: 2_000_000_000n // 2 SUI
};

// Subscribe to a tier
export async function subscribeToTier(
  account: WalletAccount,
  tier: 'free' | 'premium' | 'vip',
  signAndExecuteTransaction: any
): Promise<string> {
  const tierMap = { free: 0, premium: 1, vip: 2 };
  const tierNum = tierMap[tier];
  const price = TIER_PRICES[tier];

  const tx = new Transaction();

  let paymentCoin: any = null; // Khai báo rõ ràng

  // Split coin for payment if needed (chỉ premium/vip)
  if (price > 0n) {
    const [coin] = tx.splitCoins(tx.gas, [price]);
    paymentCoin = coin;

    // <<< FIX CHÍNH: DÙNG subscribe_entry ĐỂ CALL TỪ CLIENT >>>
    tx.moveCall({
      target: `${PACKAGE_ID}::subscription::subscribe_entry`,
      arguments: [
        tx.object(PLATFORM_ID),
        tx.pure.u8(tierNum),
        paymentCoin
      ]
    });
  }

  // Set gas budget manual để tránh lỗi estimate fee nếu RPC lag (an toàn, tx này chỉ tốn ~0.01-0.02 SUI)
  tx.setGasBudget(200_000_000); // 0.2 SUI max

  const result = await signAndExecuteTransaction({
    transaction: tx,
    account
  });

  // Wait for transaction confirmation
  await suiClient.waitForTransaction({
    digest: result.digest,
    options: { showEffects: true }
  });

  // Sync with backend
  await fetch(`${API_URL}/api/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userAddress: account.address,
      tier,
      txDigest: result.digest
    })
  });

  return result.digest;
}

// Các hàm còn lại giữ nguyên (playSong, addSong, fetch...)
export async function playSong(
  account: WalletAccount,
  songId: string,
  signAndExecuteTransaction: any
): Promise<void> {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::subscription::play_song`,
    arguments: [
      tx.object(PLATFORM_ID),
      tx.pure.id(songId)
    ]
  });

  // Thêm gas budget cho an toàn
  tx.setGasBudget(100_000_000);

  const result = await signAndExecuteTransaction({
    transaction: tx,
    account
  });

  // Record play in backend
  await fetch(`${API_URL}/api/play`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      songId,
      userAddress: account.address,
      txDigest: result.digest
    })
  });
}

// addSong, fetchSongs, fetchSubscription, ... giữ nguyên như cũ
// (copy paste từ code bạn gửi)

export async function addSong(
  account: WalletAccount,
  adminCapId: string,
  songData: {
    title: string;
    artist: string;
    album: string;
    duration: string;
    genre: string;
    tier: 'free' | 'premium' | 'vip';
    audioUrl: string;
    coverUrl: string;
  },
  signAndExecuteTransaction: any
): Promise<string> {
  const tierMap = { free: 0, premium: 1, vip: 2 };
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::subscription::add_song`,
    arguments: [
      tx.object(adminCapId),
      tx.object(PLATFORM_ID),
      tx.pure.string(songData.title),
      tx.pure.string(songData.artist),
      tx.pure.string(songData.album),
      tx.pure.string(songData.duration),
      tx.pure.string(songData.genre),
      tx.pure.u8(tierMap[songData.tier]),
      tx.pure.string(songData.audioUrl),
      tx.pure.string(songData.coverUrl)
    ]
  });

  tx.setGasBudget(200_000_000);

  const result = await signAndExecuteTransaction({
    transaction: tx,
    account
  });

  await suiClient.waitForTransaction({
    digest: result.digest,
    options: { showEvents: true }
  });

  await fetch(`${API_URL}/api/admin/songs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...songData,
      tier: songData.tier,
      txDigest: result.digest
    })
  });

  return result.digest;
}

export async function fetchSongs(tier?: string) {
  const url = tier 
    ? `${API_URL}/api/songs?tier=${tier}`
    : `${API_URL}/api/songs`;
    
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch songs');
  return response.json();
}

export async function fetchSubscription(address: string) {
  const response = await fetch(`${API_URL}/api/subscription/${address}`);
  if (!response.ok) throw new Error('Failed to fetch subscription');
  return response.json();
}

export async function fetchPlayHistory(address: string) {
  const response = await fetch(`${API_URL}/api/history/${address}`);
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
}

export async function fetchAdminStats() {
  const response = await fetch(`${API_URL}/api/admin/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}