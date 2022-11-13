import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NftService } from '../nft/nft.service';

@Injectable()
export class MetadataService {
  constructor(
    private readonly nftService: NftService,
    private readonly configService: ConfigService,
  ) {}

  sqsClient = new SQSClient({});
  QUEUE_URL = this.configService.get<string>('REFRESH_NFT_METADATA_SQS');

  async refreshMetadata(tokens: string[]) {
    // filter only valid nfts in the db
    const nfts = (await this.nftService.getNfts({ id: tokens.join(',') })).map(
      (nft) => nft.id,
    );

    // Queue up the metadata refresh requests
    const queued =
      (await Promise.all(
        nfts.map((nft) => {
          return this.#queueMetadataRefreshRequest(nft);
        }),
      )) || [];
  }

  // Push message to SQS
  async #queueMetadataRefreshRequest(nft: string) {
    if (!this.QUEUE_URL) return;
    try {
      await this.sqsClient.send(
        new SendMessageCommand({
          MessageBody: nft,
          QueueUrl: this.QUEUE_URL,
          MessageAttributes: {
            Source: {
              DataType: 'String',
              StringValue: 'Stacksonchain: /api/v1/metadatarefresh',
            },
          },
        }),
      );
      return nft;
    } catch (error) {
      console.error(`failed to queue up refresh for ${nft}`, error);
    }

    return;
  }
}
