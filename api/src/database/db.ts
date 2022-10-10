import { connect } from 'mongoose';

connect(`${process.env.DB_HOST}/comments`, {
  user: process.env.DB_USER,
  pass: process.env.DB_PW
});

console.log('MongoDB connected');
