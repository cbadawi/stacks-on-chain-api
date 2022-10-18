import { Prisma } from '@prisma/client';

export interface NftWrapper {
  nft: Nft;
}

export interface NftsWrapper {
  nfts: Nft[];
}
interface idOrContractFilter {
  asset_identifier: string | { contains?: string };
  value?: Buffer;
}
export interface nftFilter {
  OR?: idOrContractFilter[];
  recipient?: { in: string | string[] };
  AND?: {
    OR: idOrContractFilter[];
  }[];
}

export interface Nft {
  id: string; // fully qualified token id
  assetId: string;
  contractId: string;
  assetName: string;
  tokenId: number;
  owner?: string;
  blockHeight?: number;
  events?: NftEvent[];
}

export interface NftEvent {
  txId: string;
  block: number;
  sender?: string | null;
  recipient?: string | null;
  type: 'transfer' | 'mint' | 'burn';
}

export interface NftsQueryParams {
  id?: string;
  contractId?: string;
  owner?: string;
}

export type nftCustodyWithEvents = Prisma.nftCustodyGetPayload<{
  include: { nftEvents: true };
}>;
