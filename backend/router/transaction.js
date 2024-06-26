import { Router } from "express";
import TransactionModel from "../db/transactions.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const month = parseInt(req.query.month) || 3;
    const page = parseInt(req.query.page) - 1 || 0;
    const quantity = parseInt(req.query.q) || 10;
    const search = req.query.s || "";

    const transactions = await TransactionModel.aggregate([
      {
        $addFields: {
          month: { $month: "$dateOfSale" },
        },
      },
      { $match: { month: month } },
      {
        $match: {
          $or: [
            { title: new RegExp(search, "i") },
            { description: new RegExp(search, "i") },
            { price: { $eq: parseFloat(search) } },
          ],
        },
      },
      { $skip: page * quantity },
      { $limit: quantity },
      {
        $project: {
          _id: 0,
          __v: 0,
        },
      },
    ]);

    res.status(200).json({ data: transactions });
  } catch (error) {
    console.error(error);
    res.status(504).json({ error: error.message });
  }
});

export default router;
