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

  let tweet = {
    text: "Gagandeep Raju",
    postedBy: "611eea569ee3aa1150d37957",
  };

  beforeEach(async () => {
    server = require("../../../index");
    id = new mongoose.Types.ObjectId().toHexString();
  });

  afterEach(async () => {
    await server.close();
  });

  it("should return return status 200, username and password correct", async () => {
    const token = await request(server).post("/api/login").send(login);
    const decoded = jwt.verify(
      token.header["x-auth-token"],
      config.get("jwtPrivateKey")
    );
    expect(decoded.email).toBe(login.email);
  });

  it("should return 401 if logged in user create a tweet without token", async () => {
    const data = await request(server)
      .post("/api/homepage/addtweet/611eea569ee3aa1150d37957")
      .send(tweet);
    expect(data.statusCode).toBe(401);
  });

  it("should return 401 if logged in user create a tweet without token", async () => {
    tweet.postedBy = "";
    const data = await request(server)
      .post("/api/homepage/addtweet/611eea569ee3aa1150d37957")
      .send(tweet);
    expect(data.statusCode).toBe(401);
  });
});
