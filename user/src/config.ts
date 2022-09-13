const defaultPort = 80;
const region = process.env.REGION || 'us-east-1';
export default () => ({
  region,
  port: process.env.PORT || defaultPort,
});
