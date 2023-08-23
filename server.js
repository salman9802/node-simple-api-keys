
const express = require('express');
const { errorHandler } = require('./middlewares/errorMiddleware');
const { connectDB } = require('./config/db');

require('dotenv').config();
connectDB();

const userRoute = require('./routes/user');

const PORT = process.env.PORT || 80;
const app = express();


app.use('/api/user', userRoute);

app.get('/', (req, res) => {
    res.send('working');
});

app.use(errorHandler);

app.listen(PORT, ['localhost', process.env.LOCAL_IP], _=> {
    console.log(`Server started at http://localhost:${PORT}`);
    if(process.env.LOCAL_IP) console.log(`Also at http://${process.env.LOCAL_IP}:${PORT}`);
});