const region = process.env.REGION || 'us-east-1';
export default () => ({
  region,
  database: {
    endpoint: process.env.AWS_SAM_LOCAL
      ? 'http://dynamodb:8000'
      : `https://dynamodb.${region}.amazonaws.com`,
  },
});
