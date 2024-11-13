import express from 'express';

import users from './users';
import books from './books';

const silan = express.Router();


silan.use('/users', users);
silan.use('/books', books);

export default silan;
