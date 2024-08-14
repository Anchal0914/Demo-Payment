const express = require("express");
const app = express();

app.use(express.json());

const db = require("./db");
db();

app.listen(3000,()=>{console.log("listening at 3000")});

const cors = require("cors");
app.use(cors());

const rootRouter = require("./routes/index")
app.use("/api/v1", rootRouter)


