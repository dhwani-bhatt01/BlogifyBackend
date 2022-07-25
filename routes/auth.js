const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log({ username, password });
    const user = await User.findOne({ username });
    // console.log({ user });
    // !user && res.status(400).json("Wrong Credentials!");
    if (!user) {
      res.status(400).json("Wrong Credentials!");
    } else {
      // console.log(password, user.password);
      const validated = await bcrypt.compare(password, user.password);
      // console.log({ validated });
      if (!validated) {
        res.status(400).json("Wrong Credentials!!");
      } else {
        const { password, ...others } = user._doc;
        res.status(200).json(others);
      }
    }

    // const validated = await bcrypt.compare(req.body.password, user.password);
    // !validated && res.status(400).json("Wrong Credentials!!");
  } catch (err) {
    // console.log({ err });
    res.status(500).json(err);
  }
});
module.exports = router;
