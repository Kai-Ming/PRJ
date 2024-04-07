/* require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const deviceDataRoutes = require('./routes/deviceDataRoutes');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/deviceDatas', deviceDataRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('Server listening on port', process.env.PORT);
        });
    })
    .catch((error) => {
        console.log(error)
    }) 
    
q*/

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
/* const {
  errorLogger,
  errorHandler,
  notFoundHandler,
} = require("./middleware/errorMiddleware"); */

const app = express();
const port = process.env.PORT;
const env = process.env.NODE_ENV || "normal";
let dbURI;

if (env === "test") {
    dbURI = process.env.TEST_MONGO_URI;
}
else {
    dbURI = process.env.MONGO_URI;
}

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
};

app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: "50mb" }));

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/user", require("./routes/userRoutes"));

app.use("/api/device", require("./routes/deviceRoutes"));

app.use("/api/data", require("./routes/deviceDataRoutes"));

app.get("/", (req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Error handling middlewares
/* app.use(errorLogger);
app.use(errorHandler);
app.use(notFoundHandler); */

mongoose
  .connect(dbURI)
  .then(() => {
    app.listen(port, () => {
      console.log(`DB connection successful, listening on port ${port}`);
    });
  })
  .then((error) => {
    console.log(error);
  });

module.exports = app;