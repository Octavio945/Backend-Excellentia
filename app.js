const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const routes = require('./routes');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

app.get('/api/data', (req, res) => {
  res.json({ message: 'Bonjour depuis le backend !' });
})

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Error syncing database:', err));
