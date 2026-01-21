import { z } from "zod";
import { apiBaseUrl } from "../../../config";
import { type Item, itemSchema, itemsSchema } from "../types";

type RequestOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
};

const errorSchema = z.object({
  message: z.string(),
});

function isJsonResponse(response: Response): boolean {
  const contentType = response.headers.get("content-type");
  return Boolean(contentType && contentType.includes("application/json"));
}

async function readError(response: Response): Promise<Error> {
  if (isJsonResponse(response)) {
    const payload = await response.json();
    const parsed = errorSchema.safeParse(payload);
    if (parsed.success) {
      return new Error(parsed.data.message);
    }
  }
  return new Error("Request failed");
}

function createRequestInit(options: RequestOptions): RequestInit {
  const hasBody = typeof options.body !== "undefined";
  const requestInit: RequestInit = { method: options.method };
  if (hasBody) {
    requestInit.headers = { "Content-Type": "application/json" };
    requestInit.body = JSON.stringify(options.body);
  }
  return requestInit;
}

async function requestJson<T>(
  path: string,
  options: RequestOptions,
  parser: (data: unknown) => T,
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, createRequestInit(options));

  if (!response.ok) {
    throw await readError(response);
  }

  if (!isJsonResponse(response)) {
    throw new Error("Unexpected response");
  }

  const data = await response.json();
  return parser(data);
}

async function requestVoid(path: string, options: RequestOptions): Promise<void> {
  const response = await fetch(`${apiBaseUrl}${path}`, createRequestInit(options));

  if (!response.ok) {
    throw await readError(response);
  }
}

export async function getItems(): Promise<Item[]> {
  return requestJson("/items", { method: "GET" }, (data) => itemsSchema.parse(data));
}

export async function createItem(name: string): Promise<Item> {
  return requestJson(
    "/items",
    {
      method: "POST",
      body: { name },
    },
    (data) => itemSchema.parse(data),
  );
}

export async function updateItem(id: string, bought: boolean): Promise<Item> {
  return requestJson(
    `/items/${id}`,
    {
      method: "PUT",
      body: { bought },
    },
    (data) => itemSchema.parse(data),
  );
}

export async function deleteItem(id: string): Promise<void> {
  return requestVoid(`/items/${id}`, { method: "DELETE" });
}
