import 'cross-fetch/polyfill';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { StacksMainnet } from 'micro-stacks/network';
import { poolHelper } from '../helpers/defi-helpers';
import { contractPrincipalCV, uintCV } from 'micro-stacks/clarity';

const HIRO_MAINNET_DEFAULT = 'https://stacks-node-api.mainnet.stacks.co';

const network = new StacksMainnet({
  url: HIRO_MAINNET_DEFAULT,
});

export interface poolBalances {
  'balance-x': bigint;
  'balance-y': bigint;
}

export async function getPoolBalances(
  poolTrait: string,
): Promise<poolBalances> {
  const functionName = 'get-balances';
  const pool = poolHelper.find((p) => p.trait === poolTrait);

  const { contractId, tokenX, tokenY, weightX, weightY } = pool;
  const [contractAddress, contractName] = contractId.split('.');
  const [contractIdX, assetX] = tokenX.split('::');
  const [contractIdY, assetY] = tokenY.split('::');
  const [principalX, contractNameX] = contractIdX.split('.');
  const [principalY, contractNameY] = contractIdY.split('.');

  const functionArgs = [
    contractPrincipalCV(principalX, contractNameX),
    contractPrincipalCV(principalY, contractNameY),
    uintCV(weightX),
    uintCV(weightY),
  ];

  return await fetchReadOnlyFunction({
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network: network,
  });
}
