import type { Express } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

type ItemResponse = {
  id: string;
  name: string;
  bought: boolean;
};

let app: Express;
let mongoServer: MongoMemoryServer;

function parseItemResponse(body: unknown): ItemResponse {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid response");
  }
  const record = body as Record<string, unknown>;
  const idValue = record.id;
  const nameValue = record.name;
  const boughtValue = record.bought;

  if (typeof idValue !== "string") {
    throw new Error("Invalid response");
  }
  if (typeof nameValue !== "string") {
    throw new Error("Invalid response");
  }
  if (typeof boughtValue !== "boolean") {
    throw new Error("Invalid response");
  }

  return {
    id: idValue,
    name: nameValue,
    bought: boughtValue,
  };
}

async function createItem(name: string): Promise<ItemResponse> {
  const response = await request(app).post("/items").send({ name });
  expect(response.status).toBe(201);
  return parseItemResponse(response.body);
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();

  const { connectDatabase } = await import("../db/connect");
  await connectDatabase();

  const appModule = await import("../app");
  app = appModule.default;
});

beforeEach(async () => {
  const database = mongoose.connection.db;
  if (!database) {
    throw new Error("Database not ready");
  }
  await database.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("items API", () => {
  it("rejects invalid item names", async () => {
    const response = await request(app).post("/items").send({ name: "" });
    expect(response.status).toBe(400);
  });

  it("creates and lists items", async () => {
    const createdItem = await createItem("Butter");

    const listResponse = await request(app).get("/items");
    expect(listResponse.status).toBe(200);

    const listBody = listResponse.body;
    if (!Array.isArray(listBody)) {
      throw new Error("Invalid response");
    }
    expect(listBody).toHaveLength(1);
    expect(parseItemResponse(listBody[0])).toEqual(createdItem);
  });

  it("updates item status", async () => {
    const createdItem = await createItem("Tea");

    const updateResponse = await request(app)
      .put(`/items/${createdItem.id}`)
      .send({ bought: true });
    expect(updateResponse.status).toBe(200);

    const updatedItem = parseItemResponse(updateResponse.body);
    expect(updatedItem).toEqual({
      id: createdItem.id,
      name: "Tea",
      bought: true,
    });
  });

  it("returns 400 for invalid ids", async () => {
    const updateResponse = await request(app).put("/items/not-an-id").send({ bought: true });
    expect(updateResponse.status).toBe(400);

    const deleteResponse = await request(app).delete("/items/not-an-id");
    expect(deleteResponse.status).toBe(400);
  });

  it("validates update payloads", async () => {
    const createdItem = await createItem("Apples");

    const updateResponse = await request(app)
      .put(`/items/${createdItem.id}`)
      .send({ bought: "yes" });
    expect(updateResponse.status).toBe(400);
  });

  it("returns 404 for missing items", async () => {
    const missingId = new mongoose.Types.ObjectId().toString();

    const updateResponse = await request(app).put(`/items/${missingId}`).send({ bought: true });
    expect(updateResponse.status).toBe(404);

    const deleteResponse = await request(app).delete(`/items/${missingId}`);
    expect(deleteResponse.status).toBe(404);
  });

  it("deletes items", async () => {
    const createdItem = await createItem("Bread");

    const deleteResponse = await request(app).delete(`/items/${createdItem.id}`);
    expect(deleteResponse.status).toBe(204);

    const listResponse = await request(app).get("/items");
    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(0);
  });
});
