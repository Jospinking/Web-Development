// server.js -- A simple Express.js web server for serving a React.js app
import path from 'path';
import express from 'express';
//path = require('path');
//express = require('express');

const PORT = process.env.HTTP_PORT || 8081;
const app = express();
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}.`);
});  