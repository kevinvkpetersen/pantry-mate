import express from 'express';

const app = express();
const PORT = 8080;

app.get('/', (request, response) => {
    response.send({ message: 'Hello World!' });
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
