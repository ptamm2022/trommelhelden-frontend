# Trommelhelden Web-Frontend
<img width="1397" alt="screenshot_dashboard" src="https://github.com/ptamm2022/trommelhelden-frontend/assets/109551602/b6273744-503b-4cc4-86ff-3745a47d5b35">

## Start Application

1. In root folder run in cmd: `docker-compose up`.

If changes were made run `docker-compose up --build` instead.

!! IMPORTANT !! Check that the files `entrypoint.sh` and `run-initialisiton.sh` in the folder backend/Docker have the end-of-line-sequence LF

## Stop Application

In order to restart the database, it is necessary to first shut down the application.

1. In root folder run in cmd: `docker-compose down`. All data in the database will be deleted.
