import request from "supertest";
import createApp from "../src/app";

const app = createApp();

describe("User API", () => {
    test("Create a new user", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({
                firstname: "Test",
                lastname: "User",
                email: "sundayomogi00@gmail.com",
                password: "Passw0rd@123"
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("firstname", "Test");
    })
})