export default () => ({
  region: process.env.REGION || 'us-east-1',
  database: {
    isStub: process.env?.DB_STUB?.toLowerCase() === 'true',
  },
});
