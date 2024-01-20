const express = require('express');
const cors = require('cors');
const router = require('./router');
const PORT = process.env.PORT;

const app = express();

app.use(express.json())
  .use(cors())
  .use('/', router)
  .listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});