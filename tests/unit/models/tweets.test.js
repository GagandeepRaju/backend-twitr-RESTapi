const config = require("config");
const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");

describe("Unit test for User create & login", () => {
  let server;
  const login = {
    email: "abc@gmail.com",
    password: "mypassword",
  };

  beforeEach(async () => {
    server = require("../../../index");
    id = new mongoose.Types.ObjectId().toHexString();
  });

  afterEach(async () => {
    // await server.close();
  });

  it("should return return status 200", async () => {
    const token = await request(server).post("/api/login").send(login);
    let decoded = jwt.verify(
      token.header["x-auth-token"],
      config.get("jwtPrivateKey")
    );
    expect(decoded.email).toBe(signup.email);
  });
});
