import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';

describe('NftController', () => {
  let controller: NftController;
  let service: NftService;

  const mockData = {
    getNfts: [
      {
        id: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys::bitcoin-monkeys:3',
        assetId:
          'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys::bitcoin-monkeys',
        contractId: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys',
        assetName: 'bitcoin-monkeys',
        tokenId: '3',
        blockHeight: 12312,
        owner: 'SP1XPG9QFX5M95G36SGN9R8YJ4KJ0JB7ZXNH892N6',
      },
      {
        id: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys::bitcoin-monkeys:4',
        assetId:
          'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys::bitcoin-monkeys',
        contractId: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys',
        assetName: 'bitcoin-monkeys',
        tokenId: '4',
        blockHeight: 12312,
        owner: 'SP1XPG9QFX5M95G36SGN9R8YJ4KJ0JB7ZXNH892N6',
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NftController],
      providers: [
        {
          provide: NftService,
          useValue: {
            getNft: jest.fn().mockResolvedValue(mockData.getNfts[0]),
            getNfts: jest.fn().mockResolvedValue(mockData.getNfts),
          },
        },
      ],
    }).compile();

    controller = module.get<NftController>(NftController);
    service = module.get<NftService>(NftService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get nft', () => {
    it('should get an nft', async () => {
      await expect(
        controller.getNftHandler(
          'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys::bitcoin-monkeys:3',
        ),
      ).resolves.toEqual({ nft: mockData.getNfts[0] });
    });
  });

  describe('get nfts', () => {
    it('should return nft array', async () => {
      await expect(
        controller.getNftsHandler({
          contractId:
            'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys::bitcoin-monkeys:3',
        }),
      ).resolves.toEqual({ nfts: mockData.getNfts });
    });

    it('should return empty nft array', async () => {
      service.getNfts = jest.fn().mockResolvedValue([]);
      await expect(
        controller.getNftsHandler({
          contractId: 'S',
        }),
      ).resolves.toEqual({ nfts: [] });
    });
  });

  describe('get floor', () => {
    it('should throw NotFoundException', async () => {
      service.getFloor = jest.fn().mockResolvedValue([]);
      await expect(controller.getFloorHandler('S')).rejects.toThrowError(
        new NotFoundException(),
      );
    });
  });
});
