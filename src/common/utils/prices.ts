import BigNumber from 'bignumber.js';

export async function convertToUsd({
  price,
  oldBase,
  newBase,
}: {
  price: { priceInX: BigNumber; date: Date }[];
  oldBase: string;
  newBase: string;
}) {
  let tokenXUsd: any[];
  if (oldBase.includes('stx')) {
    if (newBase === 'usd') {
      const stxUsd = await dailyStxUsd();
      tokenXUsd = stxUsd;
    }
  }
  return price.map((p) => {
    return {
      ...p,
      lpUsdBase: BigNumber(
        tokenXUsd.find((base) => base.date === p.date).price,
      ).multipliedBy(p.priceInX),
    };
  });
}

export async function dailyStxUsd() {
  // TODO
  return [];
}
