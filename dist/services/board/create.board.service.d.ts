import { type BoardDetailsInputType } from "../../types/board.type.js";
import { Types } from "mongoose";
declare const CreateBoardService: (boardDetailsInput: BoardDetailsInputType) => Promise<{
    success: boolean;
    message: string;
    board?: never;
} | {
    success: boolean;
    message: string;
    board: {
        id: string;
        title: string;
        bg_color: string;
        lists: Types.ObjectId[];
    };
}>;
export default CreateBoardService;
//# sourceMappingURL=create.board.service.d.ts.map