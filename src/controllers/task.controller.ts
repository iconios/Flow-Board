import express, {type Request, type Response} from 'express';
import TokenExtraction from '../middlewares/token.extraction.util.js';
import CreateTaskService from '../services/task/create.task.service.js';

const TaskRouter = express.Router();

TaskRouter.post('/:listId',
    TokenExtraction,
    async (req: Request, res: Response) => {
        try {
            const userId = req.userId!
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User ID not found"
                })
            }

            const listId = req.params.listId;
            if (!listId) {
                return res.status(400).json({
                    success: false,
                    message: "List ID not found"
                })
            }

            const taskData = {
                ...req.body,
                listId,
            }

            const result = await CreateTaskService(userId, taskData)
            if (!result.success) {
                return res.status(400).json({
                    success: result.success,
                    message: result.message,
                })
            }

            return res.status(201).json({
                success: result.success,
                message: result.message,
                task: result.task,
            })
        } catch (error) {            
            return res.status(500).json({
                success: false,
                message: "Server error. Please try again",
                error: error
            })
        }
    }
)

export default TaskRouter;