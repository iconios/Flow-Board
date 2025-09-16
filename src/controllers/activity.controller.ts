import express, { type Request, type Response } from "express";
import TokenExtraction from "../middlewares/token.extraction.util.js";
import ReadActivityService from "../services/activity/read.activity.service.js";

const ActivityRouter = express.Router();

/*
#Plan: Get a user's Activity Logs
1. Get and ensure the user id isn't empty
2. Get the activityData
3. Call and return the result of the ReadActivityService
*/

ActivityRouter.get(
  "/",
  TokenExtraction,
  async (req: Request, res: Response) => {
    try {
      // 1. Get and ensure the user id isn't empty
      const userId = req.userId;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID required",
        });
      }

      // 2. Get the activityData
      const { object, objectId } = req.query;
      if (!object || !objectId) {
        return res.status(400).json({
          success: false,
          message: "Missing required parameters",
        });
      }
      if (object !== "Board" && object !== "Task") {
        return res.status(400).json({
          success: false,
          message: "Invalid object type",
        });
      }
      if (typeof objectId !== "string" || typeof object !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid query types",
        });
      }

      const activityData = {
        object: object as "Board" | "Task",
        objectId: objectId,
      };

      // 3. Call and return the result of the ReadActivityService
      const result = await ReadActivityService(userId, activityData);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: result.message,
        activities: result.activities,
      });
    } catch (error) {
      console.error("Server error", error);
      return res.status(500).json({
        success: false,
        message: "Server error. Please try again",
      });
    }
  },
);

export default ActivityRouter;
