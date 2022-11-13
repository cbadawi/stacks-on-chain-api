export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 80,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  REFRESH_NFT_METADATA_QUEUE: process.env.REFRESH_NFT_METADATA_SQS,
});
