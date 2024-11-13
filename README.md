# Invent Analytics Case Interview


> DATABASE_URL with password included in **.env.example** file only for easy test purposes.

> Test postgres server is running on a Supabase instance





## Setup

```
cp .env.example .env

npm ci

npx prisma migrate dev

```


## Development Server

```
npm run dev
```


## !!RESET TEST DB!!
* Drops all tables, and applies all migration files.
```
npx prisma migrate reset
```
