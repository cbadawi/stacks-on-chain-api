import { Buffer } from 'node:buffer';

export default function tokenIdToBuffer(tokenId: number): Buffer {
  const bufferLength = 17;
  let hex = tokenId.toString(16);
  if (hex.length % 2 !== 0) hex = '0'.concat(hex);
  const buff = Buffer.from(hex, 'hex');

  const placeholderBuffer = Buffer.alloc(bufferLength - buff.length - 1);

  return Buffer.concat([Buffer.from('01', 'hex'), placeholderBuffer, buff]);
}

export function byteaToHex(hex: string) {
  return hex?.replace('\\x', '0x');
}
