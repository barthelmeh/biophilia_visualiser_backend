# Biophilia Visualiser Backend

Backend for an developed for a full year project at the _University of Canterbury_  
**Author**: Tom Barthelmeh  
**Supervisors**: Brionny Hooper (_Scion_), Chenyi Zhang (_University of Canterbury_)

## About

This is the backend in ExpressJS for the Biophilia Visualiser application developed for Scion.

#### Technologies

This application uses ExpressJS and TypeScript.

## How to run

Running the application is easy.
First, install the dependencies

```bash
npm install
```

Then, setup the environment file:

```bash
cp example.env .env; rm example.env
```

Fill the .env file with the following information:

```
DB_USER={your database username}
DB_PASSWORD={your database password}
DB_SERVER={your database servername}.database.windows.net
DB_DATABASE={your database name}
DB_PORT=1433
PORT=4941
```

Then, run the application by running the following script.

```bash
npm run start
```
