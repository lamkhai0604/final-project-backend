const app = require('./app');
const http = require('http');
const fs = require('fs');
const path = require('path');


const server = http.createServer(app)

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 🎆 Shutting down ...')
    console.log(err.name, err.message);
    process.exit(1);
  });

server.listen(process.env.PORT, () => {
    console.log("App running on port ", process.env.PORT);
  });

process.on('unhandledRejection', err => {
  console.log('UNHANDLER REJECTION! 🎆 Shutting down ...')
  console.log(err.name, err.message);
  httpsserver.close(() => {
    process.exit(1);
  });
});