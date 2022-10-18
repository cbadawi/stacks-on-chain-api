export default function parseFullyQualifiedId(id: string): {
  assetId: string;
  tokenId: number;
} {
  const [contractId, asset] = id.split('::');
  const [assetName, tokenId] = asset.split(':');
  return { assetId: `${contractId}::${assetName}`, tokenId: parseInt(tokenId) };
}
