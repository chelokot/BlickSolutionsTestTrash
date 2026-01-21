const apiBaseUrl = process.env.E2E_API_BASE_URL || "http://localhost:3001";
const webBaseUrl = process.env.E2E_WEB_BASE_URL || "http://localhost:8080";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function sleep(durationMs) {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}

async function waitForUrl(url, options) {
  const timeoutMs = options.timeoutMs;
  const intervalMs = options.intervalMs;
  const expectJson = options.expectJson;
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        if (!expectJson) {
          return;
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return;
        }
      }
    } catch {
      await sleep(intervalMs);
      continue;
    }
    await sleep(intervalMs);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function parseItem(value) {
  assert(value && typeof value === "object", "Item response is not an object");
  const record = value;
  const idValue = record.id;
  const nameValue = record.name;
  const boughtValue = record.bought;

  assert(typeof idValue === "string", "Item id is missing");
  assert(typeof nameValue === "string", "Item name is missing");
  assert(typeof boughtValue === "boolean", "Item bought is missing");

  return {
    id: idValue,
    name: nameValue,
    bought: boughtValue,
  };
}

async function fetchItems() {
  const response = await fetch(`${apiBaseUrl}/items`);
  assert(response.ok, "GET /items failed");
  const items = await response.json();
  assert(Array.isArray(items), "Items response is not an array");
  return items.map(parseItem);
}

async function run() {
  await waitForUrl(`${apiBaseUrl}/items`, { timeoutMs: 30000, intervalMs: 1000, expectJson: true });
  await waitForUrl(webBaseUrl, { timeoutMs: 30000, intervalMs: 1000, expectJson: false });

  const homeResponse = await fetch(webBaseUrl);
  assert(homeResponse.ok, "Frontend did not return 200");
  const homeText = await homeResponse.text();
  assert(homeText.includes("Pantry Plan"), "Frontend content missing");

  const initialItems = await fetchItems();
  const initialCount = initialItems.length;

  const name = `E2E Item ${Date.now()}`;
  const createResponse = await fetch(`${apiBaseUrl}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  assert(createResponse.status === 201, "POST /items failed");
  const createdItem = parseItem(await createResponse.json());
  assert(createdItem.name === name, "Created item name mismatch");
  assert(createdItem.bought === false, "Created item bought should be false");

  const itemsAfterCreate = await fetchItems();
  assert(itemsAfterCreate.length === initialCount + 1, "Item not added");

  const updateResponse = await fetch(`${apiBaseUrl}/items/${createdItem.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bought: true }),
  });
  assert(updateResponse.ok, "PUT /items failed");
  const updatedItem = parseItem(await updateResponse.json());
  assert(updatedItem.bought === true, "Item was not updated");

  const deleteResponse = await fetch(`${apiBaseUrl}/items/${createdItem.id}`, {
    method: "DELETE",
  });
  assert(deleteResponse.status === 204, "DELETE /items failed");

  const itemsAfterDelete = await fetchItems();
  assert(itemsAfterDelete.length === initialCount, "Item was not deleted");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
