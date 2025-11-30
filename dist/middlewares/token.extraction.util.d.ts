import type { NextFunction, Response, Request } from "express";
interface AuthRequest extends Request {
    userId?: string;
}
declare const TokenExtraction: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default TokenExtraction;
//# sourceMappingURL=token.extraction.util.d.ts.map