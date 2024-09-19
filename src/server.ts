import app from './app';
import mongoose from 'mongoose';
import {Server} from 'http';
import config from './app/config';
const port = config.port  ;
const url = config.database_url
// console.log(port,url);


let server:Server

async function main() {
  try {
    await mongoose.connect(url as string);
    console.log('Database connected successfully');
    server = app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1); // Exit the process if the database connection fails
  }
}

main();



process.on('unhandledRejection',()=>{
  // console.log(`👿😈unhandledRejection is detected , shutting down `);
  if(server){
    server.close(()=>{
      process.exit(1);
    })
  }
  process.exit(0);
})

process.on('uncaughtException',()=>{
  // console.log(`👿😈unhandledRejection is detected , shutting down `);
  process.exit(1);
})

