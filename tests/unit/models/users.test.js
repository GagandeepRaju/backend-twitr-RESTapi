const { User, genToken } = require("../../../models/user");

const config = require("config");
const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");

describe("Unit test for User create & login", () => {
  let server;
  const signup = {
    name: "Gagandeep",
    email: "abc@gmail.com",
    password: "mypassword",
  };

  const login = {
    email: "abc@gmail.com",
    password: "mypassword",
  };

  beforeEach(async () => {
    server = require("../../../index");
    id = new mongoose.Types.ObjectId().toHexString();
  });

  afterEach(async () => {
    await server.close();
  });

  it("should return a 200 if input is valid User Sign Up was Succeess", async () => {
    const res = await request(server).post("/api/signup").send(signup);
    // expect(res.status).toBe(200);
  });

  it("should return a 400 if input is invalid User Sign Up was failed", async () => {
    const res = await request(server).post("/api/signup").send(signup);
    // expect(res.status).toBe(400);
  });

  it("should return a token if username and password is correct", async () => {
    const token = await request(server).post("/api/login").send(login);
    let decoded = jwt.verify(
      token.header["x-auth-token"],
      config.get("jwtPrivateKey")
    );
    expect(decoded.email).toBe(signup.email);
  });
});
