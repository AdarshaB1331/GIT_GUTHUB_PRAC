import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getAnalyticsData } from "../controller/analytics.controller.js";
const router = express.Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();
    res.json({ analyticsData });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
