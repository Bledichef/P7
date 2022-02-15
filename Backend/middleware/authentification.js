const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    res.locals.token = jwt.verify(token, `${process.env.KEY_TOKEN}`);
    if (req.body.userId && req.body.userId !== res.locals.token.userId) {
      throw "UserId non valide";
    } else {
      next();
    }
  } catch {
    res.status(404).json({ message: "requête non authentifiée" });
  }
};
