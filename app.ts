import express,{ Request, Response } from "express"
const app: express.Application = express();
import session from "express-session"
import connectDB from "./connect/connectDB"
import errorHandler from "./middleware/errorHandle"
import notFound from "./middleware/notFound"
require("dotenv").config();
require("express-async-errors");
import authRouter from "./routes/user"
import expensesRouter from "./routes/expenses"
import authMiiddleware from "./middleware/authorization"

import helmet from "helmet"
import cors from "cors"
// import xss from "xss-clean"

import cookieParser from "cookie-parser"

import createAccountLimiter  from "./middleware/ratelimiter"
import sendMail from "./controller/sendemail";


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
  })
);

app.get("/ip", (request:Request, response:Response) => response.send(request.ip));
app.use(express.json());
app.use(helmet());
// app.use(xss());

// app.use(cors());

app.use(cookieParser());

app.get("/", (req:Request, res:Response) => {
  res.send("fuck you");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/expenses", authMiiddleware, expensesRouter);
app.use("/api/v1/sendmail", sendMail);
app.use(errorHandler);
app.use(notFound);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI!);
    app.listen(port, () => console.log(`server listening at port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
