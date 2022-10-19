import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { Buffer } from 'buffer';
import { NftService } from './nft.service';
import tokenIdToBuffer from '../common/utils/tokenIdToBuffer';
import { nftFilter } from './interfaces/nft.interfaces';
import { BlocksService } from '../blocks/blocks.service';

describe('NftService', () => {
  let nftService: NftService;

  const mockMappedData = [
    {
      id: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys::bitcoin-monkeys:3',
      assetId:
        'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys::bitcoin-monkeys',
      contractId: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys',
      assetName: 'bitcoin-monkeys',
      tokenId: 3,
      owner: 'SP1XPG9QFX5M95G36SGN9R8YJ4KJ0JB7ZXNH892N6',
    },
    {
      id: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys::bitcoin-monkeys:4',
      assetId:
        'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys::bitcoin-monkeys',
      contractId: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys',
      assetName: 'bitcoin-monkeys',
      tokenId: 4,
      owner: 'SP1XPG9QFX5M95G36SGN9R8YJ4KJ0JB7ZXNH892N6',
    },
    {
      id: 'SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60.boom-nfts::boom:9',
      assetId: 'SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60.boom-nfts::boom',
      contractId: 'SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60.boom-nfts',
      assetName: 'boom',
      tokenId: 9,
      owner: 'SP1XPG9QFX5M95G36SGN9R8YJ4KJ0JB7ZXNH89999',
    },
  ];

  const mockDbData = [
    {
      tx_id: Buffer.from('0x123', 'hex'),
      asset_identifier:
        'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys::bitcoin-monkeys',
      value: tokenIdToBuffer(3),
      recipient: 'SP1XPG9QFX5M95G36SGN9R8YJ4KJ0JB7ZXNH892N6',
    },
    {
      tx_id: Buffer.from('0x123', 'hex'),
      asset_identifier:
        'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys::bitcoin-monkeys',
      value: tokenIdToBuffer(4),
      recipient: 'SP1XPG9QFX5M95G36SGN9R8YJ4KJ0JB7ZXNH892N6',
    },
    {
      tx_id: Buffer.from('0x123', 'hex'),
      asset_identifier:
        'SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60.boom-nfts::boom',
      value: tokenIdToBuffer(9),
      recipient: 'SP1XPG9QFX5M95G36SGN9R8YJ4KJ0JB7ZXNH89999',
    },
  ];

  const db = {
    nftCustody: {
      findFirstOrThrow: jest.fn().mockResolvedValue(mockDbData[0]),
      findMany: jest.fn().mockImplementation((filters) => {
        const whereFilter = filters.where as nftFilter;
        const orFilter = whereFilter?.OR;

        const recipientFilter = filters.where?.recipient?.in[0];
        let filteredData = mockDbData;

        const asset_identifier = orFilter
          ? orFilter[0].asset_identifier
          : undefined;

        const contractId =
          asset_identifier && typeof asset_identifier !== 'string'
            ? asset_identifier['contains']
            : undefined;
        const value = orFilter ? orFilter[0].value : undefined;

        if (orFilter) {
          if (contractId)
            filteredData = filteredData.filter((nft) =>
              nft.asset_identifier.includes(contractId),
            );

          if (asset_identifier && value)
            filteredData = filteredData.filter(
              (nft) =>
                Buffer.compare(value, tokenIdToBuffer(9)) === 0 &&
                nft.asset_identifier === asset_identifier,
            );
        }

        if (recipientFilter)
          filteredData = filteredData.filter(
            (nft) => nft.recipient === recipientFilter,
          );

        return filteredData;
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NftService,
        BlocksService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    nftService = module.get<NftService>(NftService);
  });

  it('should be defined', () => {
    expect(nftService).toBeDefined();
  });

  describe('nft', () => {
    it('should return mapped nft', async () => {
      expect(
        await nftService.getNft(
          'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys::bitcoin-monkeys:3',
        ),
      ).toStrictEqual(mockMappedData[0]);
    });
  });

  describe('nfts', () => {
    it('should return mapped nft array filtered by contract ID', async () => {
      expect(
        await nftService.getNfts({
          contractId:
            'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys',
        }),
      ).toStrictEqual([mockMappedData[0], mockMappedData[1]]);
    });

    it('should return mapped nft array filtered by Fully Qualified ID', async () => {
      expect(
        await nftService.getNfts({
          id: 'SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60.boom-nfts::boom:9',
        }),
      ).toStrictEqual([mockMappedData[2]]);
    });

    it('should return mapped nft array filtered by owner', async () => {
      expect(
        await nftService.getNfts({
          owner: 'SP1XPG9QFX5M95G36SGN9R8YJ4KJ0JB7ZXNH89999',
        }),
      ).toStrictEqual([mockMappedData[2]]);
    });
  });
});
