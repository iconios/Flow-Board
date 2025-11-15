import express from "express";
import TokenExtraction from "../middlewares/token.extraction.util.js";
import CreateCommentService from "../services/comment/create.comment.service.js";
import ReadCommentService from "../services/comment/read.comment.service.js";
import UpdateCommentService from "../services/comment/update.comment.service.js";
import DeleteCommentService from "../services/comment/delete.comment.service.js";
const CommentRouter = express.Router();
/*
#Plan: Create a Comment API
1. Get and validate the user id, task id, and input data
2. Pass the inputs to the CreateCommentService
3. Return the result to the user
*/
CommentRouter.post("/:taskId", TokenExtraction, async (req, res) => {
  try {
    // 1. Get and validate the user id, task id, and input data
    const userId = req.userId;
    const taskId = req.params.taskId;
    const inputData = req.body;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User ID not found",
      });
    }
    if (!taskId) {
      return res.status(404).json({
        success: false,
        message: "Task ID not found",
      });
    }
    if (!Object.keys(inputData).length) {
      return res.status(400).json({
        success: false,
        message: "Missing comment data required",
      });
    }
    // 2. Pass the inputs to the CreateCommentService
    const result = await CreateCommentService(userId, taskId, inputData);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    // 3. Return the result to the user
    return res.status(201).json({
      success: true,
      message: result.message,
      comment: result.comment,
    });
  } catch (error) {
    console.error("Server error", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again",
    });
  }
});
/*
#Plan: Read all Comments of a Task API
1. Get and validate the user id, task id
2. Pass the inputs to the ReadCommentService
3. Return the result to the user
*/
CommentRouter.get("/:taskId", TokenExtraction, async (req, res) => {
  try {
    // 1. Get and validate the user id, task id
    const userId = req.userId;
    const taskId = req.params.taskId;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User ID not found",
      });
    }
    if (!taskId) {
      return res.status(404).json({
        success: false,
        message: "Task ID not found",
      });
    }
    // 2. Pass the inputs to the ReadCommentService
    const result = await ReadCommentService(userId, taskId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    // 3. Return the result to the user
    return res.status(200).json({
      success: true,
      message: result.message,
      comments: result.comments,
    });
  } catch (error) {
    console.error("Server error", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again",
    });
  }
});
/*
#Plan: Update a Comment API
1. Get and validate the user id, comment id
2. Pass the inputs to the UpdateCommentService
3. Return the result to the user
*/
CommentRouter.patch("/:commentId", TokenExtraction, async (req, res) => {
  try {
    // 1. Get and validate the user id, comment id
    const userId = req.userId;
    const commentId = req.params.commentId;
    const updateData = req.body;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User ID not found",
      });
    }
    if (!commentId) {
      return res.status(404).json({
        success: false,
        message: "Comment ID not found",
      });
    }
    if (!Object.keys(updateData).length) {
      return res.status(400).json({
        success: false,
        message: "Missing comment data required",
      });
    }
    // 2. Pass the inputs to the UpdateCommentService
    const result = await UpdateCommentService(userId, commentId, updateData);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    // 3. Return the result to the user
    return res.status(200).json({
      success: true,
      message: result.message,
      comment: result.comment,
    });
  } catch (error) {
    console.error("Server error", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again",
    });
  }
});
/*
#Plan: Delete a Comment API
1. Get and validate the user id, comment id
2. Pass the inputs to the DeleteCommentService
3. Return the result to the user
*/
CommentRouter.delete("/:commentId", TokenExtraction, async (req, res) => {
  try {
    // 1. Get and validate the user id, comment id
    const userId = req.userId;
    const commentId = req.params.commentId;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User ID not found",
      });
    }
    if (!commentId) {
      return res.status(404).json({
        success: false,
        message: "Comment ID not found",
      });
    }
    // 2. Pass the inputs to the DeleteCommentService
    const result = await DeleteCommentService(userId, commentId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    // 3. Return the result to the user
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Server error", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again",
    });
  }
});
export default CommentRouter;
//# sourceMappingURL=comment.controller.js.map
