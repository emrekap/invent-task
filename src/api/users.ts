import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';
import { prismaClient } from '../libs/prismaClient';
import { StatusCodes } from 'http-status-codes';

// All routes has /users prefix
const router = express.Router();

/**
 * @GET /users
 * @returns all users
 */
router.get('/', async (_req, res) => {
  const users = await prismaClient.user.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } });
  res.json(users);
});


/**
 * @GET /users/:id
 * @returns user with given id
 */
router.get('/:id', validateRequest({
  params: z.object({
    id: z.coerce.number(),
  }),
}), async (req, res, next) => {
  try {
    const user = await prismaClient.user.findFirst({
      where: { id: +req.params.id },
      include: {
        borrowHistory: {
          select: {
            score: true,
            book: { select: { name: true },
            },
          },
        },
      },
    });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User does not exists' });
    }

    const present = user.borrowHistory.filter(h => h.score === -1).map(h => ({ name: h.book.name }));
    const past = user.borrowHistory.filter(h => h.score > -1).map(h => ({ name: h.book.name, userScore: h.score }));


    res.json({
      id: user.id,
      name: user.name,
      books: {
        past,
        present,
      },
    });

  } catch (error) {
    next(error);
  }

});

/**
 * @POST /users
 * Creates user with given name
 */
router.post('/',
  validateRequest({ body: z.object({
    name: z.string(),
  }) }),
  async (req, res, next) => {
    try {
      await prismaClient.user.create({
        data: { name: req.body.name },
      });
      res.status(StatusCodes.CREATED).end();
    } catch (error) {
      console.log(error);
      next(error);
    }
  });


/**
 * @POST /users/:userId/borrow/:bookId
 * Creates user with given name
 */
router.post('/:userId/borrow/:bookId',
  validateRequest({
    params: z.object({
      userId: z.coerce.number(),
      bookId: z.coerce.number(),
    }),
  }),
  async (req, res, next) => {
    console.log('req.params: ', req.params);
    const { userId, bookId } = req.params;

    try {
      const user = await prismaClient.user.findFirst({ where: { id: +userId } });
      if (!user)
        return res.status(StatusCodes.NOT_FOUND).end('User does not exists');

      const book = await prismaClient.book.findFirst({ where: { id: +bookId } });
      if (!book)
        return res.status(StatusCodes.NOT_FOUND).end('Book does not exists');

      if (book.borrowed)
        return res.status(StatusCodes.NOT_FOUND).end('Book already borrowed. Cannot borrowed until it returned.');

      await prismaClient.$transaction([
        prismaClient.borrowHistory.create({ data: { bookId: book.id, userId: user.id, returned: false } }),
        prismaClient.book.update({ data: { borrowed: true }, where: { id: book.id } }),
      ]);
      res.status(StatusCodes.NO_CONTENT).end();
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

/**
 * @POST /users/:userId/borrow/:bookId
 * Creates user with given name
 */
router.post('/:userId/return/:bookId',
  validateRequest({
    params: z.object({
      userId: z.coerce.number(),
      bookId: z.coerce.number(),
    }),
    body: z.object({
      score: z.number().min(0).max(100),
    }),
  }),
  async (req, res, next) => {
    console.log('req.params: ', req.params);
    const { userId, bookId } = req.params;
    const { score } = req.body;

    try {
      const user = await prismaClient.user.findFirst({ where: { id: +userId } });
      if (!user)
        return res.status(StatusCodes.NOT_FOUND).end('User does not exists');

      const book = await prismaClient.book.findFirst({ where: { id: +bookId } });
      if (!book)
        return res.status(StatusCodes.NOT_FOUND).end('Book does not exists');

      if (!book.borrowed)
        return res.status(StatusCodes.BAD_REQUEST).end('Book is not borrowed. Cannot be returned.');
      const borrowedBook = await prismaClient.borrowHistory.findFirst({ where:{ userId: user.id, bookId:book.id, score: -1, book: { borrowed: true } } });
      if (!borrowedBook) return res.status(StatusCodes.BAD_REQUEST).end('User has not borrowed this book');

      await prismaClient.$transaction([
        prismaClient.borrowHistory.update({ data: { returned: true, score }, where: { id: borrowedBook.id  } }),
        prismaClient.book.update({ data: { borrowed: false }, where: { id: book.id } }),
      ]);
      res.status(StatusCodes.NO_CONTENT).end();
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

export default router;
