import { describe, expect, test } from "vitest";
const { createToken, validateToken } = require("./authn");

describe("Authentication Service (JWT)", () => {
  const dummyUser = {
    _id: "user_test_12345",
    name: "Alex Doe",
    email: "alex@example.com",
  };

  test("createToken generates a valid JWT string containing user details", () => {
    const token = createToken(dummyUser);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3); // JWT header.payload.signature

    const payload = validateToken(token);
    expect(payload._id).toBe(dummyUser._id);
    expect(payload.name).toBe(dummyUser.name);
    expect(payload.email).toBe(dummyUser.email);
  });

  test("validateToken throws an error when given an invalid token", () => {
    expect(() => validateToken("invalid.token.signature")).toThrow();
  });
});
