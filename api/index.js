const express = require("express");

const app = express();
const PORT = 8080;

app.get("/", (req, res) => {
    res.send({"message": "Hello World!"});
});

app.listen(
    PORT,
    () => console.log(`Listening on http://localhost:${PORT}`)
);
