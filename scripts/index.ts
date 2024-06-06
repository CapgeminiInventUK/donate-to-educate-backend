// import axios from 'axios';
import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';

const app: Application = express();
dotenv.config();

app.use(express.json());

app.get('/graphql', function (req: Request, res: Response) {
  try {
    // const data = axios.get(process.env.PUBLIC_RESOLVER_URL ?? '');
    res.status(200).json({ res: 200 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
