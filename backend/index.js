
const express = require("express")
const ConnectDB = require("./db");
const cors = require("cors")


ConnectDB();
const app = express()
const port = 5000

app.use(express.json());
app.use(cors({
  origin:[
    "http://localhost:3000",
    "https://i-notebook-frontend-r4ou.onrender.com"
  ]
}));

app.use("/api/authentication", require("./routes/authentication"));
app.use("/api/notes", require("./routes/note"));

app.listen(port, () => {
  console.log(` app listening on port ${port}`)
})

