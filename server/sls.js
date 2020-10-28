const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

routes(app);

if (!process.env.SERVERLESS) {
  app.listen(3000, () => {
    console.log(`Server start on http://localhost:3000`);
  });
}

module.exports = app;
