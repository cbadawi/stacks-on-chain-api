import { nftCustody, Prisma } from '@prisma/client';
import { nftCustodyWithEvents } from '../../common/interfaces/nft.interfaces';
import { Nft } from '../../common/interfaces/nft.interfaces';

export function nftMapperWithEvents(nft: nftCustodyWithEvents): Nft {
  let mapped = nftMapper(nft as nftCustody);

  if (nft?.nftEvents)
    mapped = {
      ...mapped,
      events: nft.nftEvents
        .filter((event) => event.canonical && event.microblock_canonical)
        .sort((a, b) => b.block_height - a.block_height)
        .map((event) => {
          return {
            txId: `0x${event.tx_id.toString('hex')}`,
            block: event.block_height,
            sender: event.sender,
            recipient: event.recipient,
            type:
              event.asset_event_type_id === 1
                ? 'transfer'
                : event.asset_event_type_id === 2
                ? 'mint'
                : 'burn',
          };
        }),
    };

  return mapped;
}

export function nftMapper(nft: nftCustody): Nft {
  if (!nft) return null;
  const tokenId = parseInt(nft.value.slice(1).toString('hex'), 16);
  const [contractId, assetName] = nft.asset_identifier.split('::');

  return {
    id: `${nft.asset_identifier}:${tokenId}`,
    assetId: nft.asset_identifier,
    contractId,
    assetName,
    tokenId,
    owner: nft.recipient || '',
  };
}
