const express = require('express');
require('dotenv').config({ path: '../.env' });

const cors = require('cors');
const app = express();
const port = process.env.PORT||5000;
const MongoDB = require('./db');
const path = require('path');
MongoDB();
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use(cors({
  // origin:"https://dudewala.onrender.com"
  origin: "http://localhost:3000"
}));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json())
app.use('/api',require('./Routes/CreateUser'))
app.use('/api',require('./Routes/DisplayData'))
app.use('/api',require('./Routes/OrderData'))
app.use('/api',require('./Routes/DefaultOrderdata'))
app.use('/api',require('./Routes/ingredientRoutes'))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
if (process.env.NODE_ENV === 'production') {
  
  app.use(express.static('/build'));

  app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, 'build','index.html')));
}