import express, {} from "express";
import TokenExtraction from "../middlewares/token.extraction.util.js";
import ReadChecklistService from "../services/checklist/read.checklist.service.js";
import CreateChecklistService from "../services/checklist/create.checklist.service.js";
import EditChecklistService from "../services/checklist/edit.checklist.service.js";
import DeleteChecklistService from "../services/checklist/delete.checklist.service.js";
const ChecklistRouter = express.Router();
// Get all Checklists
/*
#Plan:
1. Get the userId and taskId
2. Pass to ReadChecklistService
3. Return response based on service response
*/
ChecklistRouter.get("/task/:taskId", TokenExtraction, async (req, res) => {
    // Logic to get all checklists
    try {
        // 1. Get the userId and taskId
        const userId = req.userId;
        const taskId = req.params.taskId;
        // 2. Pass to ReadChecklistService
        const result = await ReadChecklistService(taskId, userId);
        // 3. Return response based on service response
        if (!result.success) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Unknown error while fetching checklists", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});
// Create a Checklist
/*
#Plan:
1. Get the userId, taskId and boardId from params, and content from request body
2. Pass to CreateChecklistService
3. Return response based on service response
*/
ChecklistRouter.post("/task/:taskId/board/:boardId", TokenExtraction, async (req, res) => {
    // Logic to create a checklist
    try {
        // 1. Get the userId, taskId, boardId, and content from request body
        const userId = req.userId;
        const taskId = req.params.taskId;
        const boardId = req.params.boardId;
        const { content } = req.body;
        // 2. Pass to CreateChecklistService
        const result = await CreateChecklistService({
            userId,
            taskId,
            boardId,
            content,
        });
        // 3. Return response based on service response
        if (!result.success) {
            return res.status(400).json(result);
        }
        return res.status(201).json(result);
    }
    catch (error) {
        console.error("Unknown error while creating checklist", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});
// Edit a Checklist
/*
#Plan:
1. Get the userId, checklistId from params, and content from request body
2. Pass to EditChecklistService
3. Return response based on service response
*/
ChecklistRouter.patch("/:checklistId", TokenExtraction, async (req, res) => {
    // Logic to edit a checklist
    try {
        // 1. Get the userId, checklistId from params, and content from request body
        const userId = req.userId;
        const checklistId = req.params.checklistId;
        const updateBody = req.body;
        // 2. Pass to EditChecklistService
        const result = await EditChecklistService(userId, {
            checklistId,
            ...updateBody,
        });
        // 3. Return response based on service response
        if (!result.success) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Unknown error while editing checklist", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});
// Delete a Checklist
/*
#Plan:
1. Get the userId, and checklistId from params
2. Pass to DeleteChecklistService
3. Return response based on service response
*/
ChecklistRouter.delete("/:checklistId", TokenExtraction, async (req, res) => {
    // Logic to delete a checklist
    try {
        // 1. Get the userId, and checklistId from params
        const userId = req.userId;
        const checklistId = req.params.checklistId;
        // 2. Pass to DeleteChecklistService
        const result = await DeleteChecklistService({ userId, checklistId });
        // 3. Return response based on service response
        if (!result.success) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Unknown error while deleting checklist", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});
export default ChecklistRouter;
//# sourceMappingURL=checklist.controller.js.map