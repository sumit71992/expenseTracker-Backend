const path = require("path");
const fs = require("fs");
// const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const morgan = require("morgan");
const sequelize = require("./util/database");
const errorController = require("./controllers/error");

const Expense = require("./models/expenseModel");
const User = require("./models/userModel");
const Order = require("./models/orderModel");
const Forgot = require("./models/forgotPasswordModel");

require("dotenv").config();

const app = express();
app.use(compression());
// const privateKey = fs.readFileSync("server.key");
// const certificate = fs.readFileSync("server.cert");

const mainRoutes = require("./routes/expenseRoute");
const userRoutes = require("./routes/userRoute");
const orderRoutes = require("./routes/orderRoute");
const passwordRoutes = require("./routes/passwordRoute");

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/expense", mainRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use("/password", passwordRoutes);
app.use((req, res) => {
  if(req.url=="/"){
    res.sendFile(path.join(__dirname, `views/signin.html`));
  }else{
    res.sendFile(path.join(__dirname, `views/${req.url}`));
  }
});

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(errorController.get404);

Expense.belongsTo(User);
User.hasMany(Expense);

User.hasMany(Order);
Order.belongsTo(User);

Forgot.belongsTo(User);
User.hasMany(Forgot);
sequelize
  .sync()
  .then((res) => {
    app.listen(port);
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    //   .listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
