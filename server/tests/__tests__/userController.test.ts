/// <reference types="jest" />

import request from "supertest";  // correct import
import express from "express";
import authController from "../../src/controllers/auth.controller";

const app = express();
app.use(express.json()); // bodyParser ki jagah

app.post("/register", authController.register);
describe("Auth Controller - Register", () => {
  const userData = {
    name: "Test User",
    email: "test@example.com",
    password: "Password123"
  };

  afterAll(async () => {
    // Close DB/Redis connections
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/register").send(userData);
    console.log(res.body); // log for debugging
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should fail for duplicate email", async () => {
    await request(app).post("/register").send(userData); // first insert
    const res = await request(app).post("/register").send(userData); // duplicate
    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });
});
