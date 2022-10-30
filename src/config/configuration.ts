export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 80,
  NODE_ENV: process.env.NODE_ENV || 'localhost',
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_BASE_URL:
    process.env.NODE_BASE_URL || 'https://stacks-node-api.mainnet.stacks.co', // stacks mainnet throttles api calls, better to have your own node running.
});
