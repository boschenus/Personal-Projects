import express, { Express } from "express";
import { addPoll, delete_poll, getPoll, listPolls, votePoll } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.post('/api/add', addPoll);
app.post('/api/vote', votePoll);
app.post('/api/get', getPoll);
app.get('/api/list', listPolls);
app.post('/api/delete', delete_poll);
app.listen(port, () => console.log(`Server listening on ${port}`));
