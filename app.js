const express = require("express");
const app = express();
const session = require("express-session");
const connectDB = require("./connect/connectDB");
const errorHandler = require("./middleware/errorHandle");
const notFound = require("./middleware/notFound");
require("dotenv").config();
require("express-async-errors");
const authRouter = require("./routes/user");
const expensesRouter = require("./routes/expenses");
const authMiiddleware = require("./middleware/authorization");

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

const cookieParser = require("cookie-parser");

const { createAccountLimiter } = require("./middleware/ratelimiter");


app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "Super Secret (change it)",
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // must be 'none' to enable cross-site delivery
      secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
    },
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND,
    methods: ["GET", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["content-type", "Authorization", "x-csrf-token", "cookie"],
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.get("/ip", (request, response) => response.send(request.ip));
app.use(express.json());
app.use(helmet());
app.use(xss());

// app.use(cors());

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("fuck you");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/expenses", authMiiddleware, expensesRouter);
app.use(errorHandler);
app.use(notFound);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`server listening at port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
