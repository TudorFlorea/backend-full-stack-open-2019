const mongoose = require("mongoose");

const connect = () => {
  const url = process.env.MONGODB_URI;
  mongoose.set("useFindAndModify", false);
  mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("connected to mongoDB");
    })
    .catch(err => {
      console.log("connection error", err.message);
    });
};

module.exports.connect = connect;
