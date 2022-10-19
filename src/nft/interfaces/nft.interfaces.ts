import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class NftWrapper {
  nft: Nft;
}

export class NftsWrapper {
  nfts: Nft[];
}

export class FloorWrapper {
  floor: FloorPrice[];
}

export class FloorPrice {
  date: Date;
  floor: string;
  @IsOptional()
  contractId?: string;
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

export class Nft {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  id: string; // fully qualified token id
  assetId: string;
  contractId: string;
  assetName: string;
  tokenId: number;
  owner?: string;
  blockHeight?: number;
  events?: NftEvent[];
}

export class NftEvent {
  txId: string;
  block: number;
  sender?: string | null;
  recipient?: string | null;
  type: 'transfer' | 'mint' | 'burn';
}

export class NftsQueryParams {
  @IsOptional()
  id?: string;
  @IsOptional()
  contractId?: string;
  @IsOptional()
  owner?: string;
}

export type nftCustodyWithEvents = Prisma.nftCustodyGetPayload<{
  include: { nftEvents: true };
}>;
