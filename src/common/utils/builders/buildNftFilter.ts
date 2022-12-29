import commaSeperatedToArray from '../commaSeperatedToArray';
import parseFullyQualifiedId from '../parseFullyQualifiedId';
import tokenIdToBuffer from '../tokenIdToBuffer';
import { nftFilter } from '../../../nft/interfaces/nft.interfaces';

export default function buildNftFilter(
  id?: string,
  contractId?: string,
  owner?: string,
) {
  const filter: nftFilter = {};

  // Build id filter
  if (id) {
    const idsArray = commaSeperatedToArray(id);
    const idsParsed = idsArray.map(parseFullyQualifiedId);

    const idOrFilter = idsParsed.map((id) => {
      return {
        asset_identifier: id.assetId,
        value: tokenIdToBuffer(id.tokenId),
      };
    });

    filter['OR'] = idOrFilter;
  }

  // build owner filter
  if (owner)
    filter['recipient'] = {
      in: commaSeperatedToArray(owner) || '',
    };

  // build contractid filter
  // however, id and contractid filters will collide.
  if (contractId) {
    const contractsArray = commaSeperatedToArray(contractId);

    const contractOrFilter = contractsArray.map((contract) => {
      return {
        asset_identifier: {
          contains: `${contract}::`,
        },
      };
    });
    // hence if only contract is passed as argument; add the contractid filter normally
    if (!id) filter['OR'] = contractOrFilter;
    // else if both are passed then the user would expect filter on both using the AND kewyword.
    // => remove the id filter previously added and put it in an AND array filter alongside the contractid filter.
    else {
      filter['AND'] = [{ OR: contractOrFilter }, { OR: filter['OR'] }];
      delete filter['OR']; // delet idOrFilter
    }
  }

  return filter;
}
