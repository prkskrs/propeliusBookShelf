import User from "../models/user.js";
import Book from "../models/book.js";
import Category from "../models/category.js";

export const addBook = async (req, res, next) => {
  try {
    const { title, author, category, readStatus } = req.body;
    const user = req.user._id;
    let filename = req.files;
    const coverImage = "/coverImage/" + filename.coverImage[0].originalname;

    if (!(title && author)) {
      return res.status(400).json({
        success: false,
        message: "title and author is required.",
      });
    }

    const categoryExists = await Category.findOne({ _id: category })
      .lean()
      .catch((err) => {
        console.log(`error getting category :: ${err}`);
        return null;
      });

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "no such category exists",
      });
    }

    const addedBook = await Book.create({
      title,
      author,
      coverImage,
      category,
      user,
      readStatus,
    }).catch((err) => {
      console.log(`error adding book ::  ${err}`);
      return null;
    });

    const response = {
      success: true,
      message: "Book Added Successfully!",
      data: addedBook,
    };

    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
  }
};

export const getAllBook = async (req, res, next) => {
  try {
    const { search, categoryId, page, limit } = req.query;
    const skip = (page - 1) * limit;
    const query = {};
    if (search) {
      query.$or = [
        {
          title: { $regex: search, $options: "i" },
        },
        {
          author: { $regex: search, $options: "i" },
        },
      ];
    }

    if (categoryId) {
      query.category = categoryId;
    }

    const allBook = await Book.find(query)
      .skip(skip)
      .limit(limit)
      .lean()
      .catch((err) => {
        console.log(`error getting book :: ${err}`);
        return null;
      });

    if (allBook === null) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }

    const response = {
      success: true,
      message: "All Books Of Your Search.",
      count: allBook.length,
      data: allBook,
    };
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
  }
};
