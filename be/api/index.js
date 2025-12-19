// be/api/api/index.js
const app = require('../dist/server.js');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default app;