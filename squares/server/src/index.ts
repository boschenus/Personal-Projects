import express, { Express } from "express";
import { dummy, listNames, save, load, delete_square } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/dummy", dummy);
app.get("/api/list", listNames);
app.post("/api/save", save);
app.get("/api/load", load);
app.post("/api/delete", delete_square);
app.listen(port, () => console.log(`Server listening on ${port}`));
