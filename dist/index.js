// src/index.ts
import { createServer } from "node:http";
import * as dotenv from "dotenv";
import dbConnect from "./dbConnection.js";
import createApp from "./app.js";
import { createSocketServer } from "./socket.js";
import { verifyMailer } from "./utils/mailer.util.js";
dotenv.config({ quiet: true });
if (process.env.NODE_ENV !== "test") {
    await verifyMailer();
}
const app = createApp();
const server = createServer(app);
createSocketServer(server);
// parse port safely
const PORT = Number(process.env.PORT) || 8000;
// Connect DB only outside tests
if (process.env.NODE_ENV !== "test") {
    dbConnect().catch(console.dir);
    server.listen(PORT, () => {
        console.log("Server running on Port", PORT);
    });
}
export { app, server };
export default app;
//# sourceMappingURL=index.js.map