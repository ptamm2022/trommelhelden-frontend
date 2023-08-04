# Trommelhelden Web-Frontend
<img width="1397" alt="Bildschirmfoto 2023-08-01 um 23 08 29" src="https://github.com/ptamm2022/trommelhelden-frontend/assets/109551602/b6273744-503b-4cc4-86ff-3745a47d5b35">

## Start Application

1. In root folder run in cmd: `docker-compose up -d`.

If changes were made run `docker-compose up --build` instead.

!! IMPORTANT !! Check that the files `entrypoint.sh` and `run-initialisiton.sh` in the folder backend/Docker have the end-of-line-sequence LF 

## Start Backend Dev Server

1. Create .env file in backend folder containing the following string

`DATABASE_URL="sqlserver://localhost:1433;initial catalog=trommelhelden;user=sa;password=Trommelhelden1;TrustServerCertificate=true;" `

2. `cd backend`

3. run init script `npm run init`

to start backend dev server run `npm run dev`

## Start Prisma Studio (GUI)

run `cd backend && npx prisma studio --schema=./src/prisma/schema.prisma`

## Start Frontend Dev Server

1. run `cd frontend && npm i`

2. run `npm run dev` to run frontend dev server on `http://127.0.0.1:5173`

### DB Schema

![Trommelhelden Schema](db_schema.png)
