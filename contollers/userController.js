import User from "../models/user.js";
import bigPromise from "../middlewares/bigPromise.js";
import Book from "../models/book.js";
const options = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

export const signup = bigPromise(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const toStore = {
      name,
      email,
      password,
    };

    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Password fields are required",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already exists",
      });
    }
    const user = await User.create(toStore);
    const data = { token: user.getJwtToken(), user };

    const response = {
      success: true,
      message: "User Registered Successfully!",
      data: data,
    };
    res.status(200).cookie("token", data.token, options).send(response);
  } catch (error) {
    console.log(error);
  }
});

export const login = bigPromise(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({
        success: false,
        message: "Email and Password fields are required",
      });
    }

    const userExists = await User.findOne({ email: email });

    if (userExists) {
      const isPasswordCorrect = await userExists.isValidatedPassword(
        password,
        userExists.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: "Incorrect Password!",
        });
      }
      userExists.password = undefined;
      const data = { token: userExists.getJwtToken(), userExists };
      const response = {
        success: true,
        message: "User LoggedIn Successfully!",
        data: data,
      };
      return res.cookie("token", data.token, options).send(response);
    } else {
      return res.status(400).json({
        success: false,
        message: "You're not registered in our app",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

export const logout = bigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  return res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

export const myBookShelf = bigPromise(async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log(userId);

    const allBook = await Book.find({
      user: userId,
    })
      .lean()
      .catch((err) => {
        console.log(`error getting books ${err}`);
        return null;
      });

    if (allBook === null) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }

    console.log(allBook);
    const response = {
      success: true,
      message: `Hello ${req.user.name}, All Your Book on BookShelf.`,
      data: allBook,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
  }
});
