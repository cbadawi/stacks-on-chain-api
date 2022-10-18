import { Test, TestingModule } from '@nestjs/testing';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';

describe('BlocksController', () => {
  let controller: BlocksController;
  let service: BlocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlocksController],
      providers: [
        {
          provide: BlocksService,
          useValue: {
            getTipHeight: jest.fn().mockReturnValue(100),
          },
        },
      ],
    }).compile();

    controller = module.get<BlocksController>(BlocksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getBlocks', () => {
    it('should return maxBlock', async () => {
      expect(await controller.getBlocks()).toStrictEqual({ tip: 100 });
    });
  });
});
