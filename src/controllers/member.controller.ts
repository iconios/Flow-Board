import express, { type Request, type Response } from 'express';
import TokenExtraction from '../middlewares/token.extraction.util.js';
import ReadMemberService from '../services/member/read.member.service.js';

const BoardMemberRouter = express.Router();
BoardMemberRouter.get('/:boardId',
    TokenExtraction,
    async (req: Request, res: Response) => {
        try {
            const userId = req.userId;
            const boardId = req.params.boardId?.trim()
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Owner Id required"
                })
            }

            if (!boardId) {
                return res.status(401).json({
                    success: false,
                    message: "Board Id required"
                })
            }
            const readMemberInput = {
                ownerId: req.userId!,
                boardId: req.params.boardId!
            }
            const result = await ReadMemberService(readMemberInput)
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.message
                })
            }
            
            return res.status(200).json({
                success: true,
                message: result.message,
                members: result.members
            })
        } catch (error) {
            console.error("Error reading board members", error)

            return res.status(500).json({
                success: false,
                message: "Server Error. Please try again",
            })
        }
    }
)

export default BoardMemberRouter;