-- CreateTable
CREATE TABLE "borrow_history" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "returned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "borrow_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "borrow_history" ADD CONSTRAINT "borrow_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow_history" ADD CONSTRAINT "borrow_history_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
