import express from 'express';
import { z } from 'zod';
import { prismaClient } from '../libs/prismaClient';
import { StatusCodes } from 'http-status-codes';
import { validateRequest } from 'zod-express-middleware';

// All routes has /books prefix
const router = express.Router();

/**
 * @GET /books
 * @returns all books
 */
router.get('/', async (_req, res) => {
  const books = await prismaClient.book.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } });
  res.json(books);
});


/**
 * @GET /books/:id
 * @returns book with given id
 */
router.get('/:id', validateRequest({
  params: z.object({
    id: z.coerce.number(),
  }),
}), async (req, res, next) => {
  try {
    const book = await prismaClient.book.findFirst({
      select: { id: true, name: true },
      where: { id: +req.params.id },
    });
    if (!book)
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Book does not exists' });

    const bookScore = await prismaClient.borrowHistory.aggregate({
      _avg: {
        score: true,
      },
      where: { bookId: book.id },
    });
    const score = bookScore._avg.score ? +bookScore._avg.score.toFixed(2) : -1;

    res.json({ ...book, score });

  } catch (error) {
    next(error);
  }

});

/**
 * @POST /books
 * Creates book with given name
 */
router.post('/',
  validateRequest({ body: z.object({
    name: z.string(),
  }) }),
  async (req, res, next) => {
    try {
      const book = await prismaClient.book.create({
        data: { name: req.body.name },
      });
      console.log(book);
      res.status(StatusCodes.CREATED).end();
    } catch (error) {
      console.log(error);
      next(error);
    }

  });



export default router;
