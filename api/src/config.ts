export default () => ({
  region: process.env.REGION || 'us-east-1',
  database: {
    isNotStub: process.env.local !== 'True',
  },
});
