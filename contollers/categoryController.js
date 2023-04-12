import Category from "../models/category.js";

export const addCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "name is required for any category.",
      });
    }

    const categoryExists = await Category.findOne({ name })
      .lean()
      .catch((err) => {
        console.log(`error getting category :: ${err}`);
        return null;
      });

    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: "category of this name already exists",
      });
    }

    const addedCategory = await Category.create({
      name,
    }).catch((err) => {
      console.log(`error creating category :: ${err}`);
      return null;
    });

    return res.json({
      success: true,
      message: "Category Added Successfully!",
      data: addedCategory,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllCategory = async (req, res, next) => {
  try {
    const { search, page, limit } = req.query;
    const skip = (page - 1) * limit;
    const query = {};
    if (search) {
      query.$or = [
        {
          name: { $regex: search, $options: "i" },
        },
      ];
    }
    const allCategory = await Category.find(query)
      .skip(skip)
      .limit(limit)
      .lean()
      .catch((err) => {
        console.log(`error getting category :: ${err}`);
        return null;
      });

    if (allCategory === null) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }

    const response = {
      success: true,
      message: "All Categories Of Your Search.",
      count: allCategory.length,
      data: allCategory,
    };
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
  }
};
