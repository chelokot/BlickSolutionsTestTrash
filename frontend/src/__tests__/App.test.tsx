import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../app/App";
import * as itemsApi from "../features/items/api/itemsApi";
import type { Item } from "../features/items/types";

vi.mock("../features/items/api/itemsApi", () => ({
  getItems: vi.fn(),
  createItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn(),
}));

const mockedItemsApi = vi.mocked(itemsApi);

beforeEach(() => {
  mockedItemsApi.getItems.mockResolvedValue([]);
  mockedItemsApi.createItem.mockImplementation(
    async (name: string) =>
      ({
        id: "1",
        name,
        bought: false,
      }) satisfies Item,
  );
  mockedItemsApi.updateItem.mockImplementation(
    async (id: string, bought: boolean) =>
      ({
        id,
        name: "Milk",
        bought,
      }) satisfies Item,
  );
  mockedItemsApi.deleteItem.mockResolvedValue();
});

describe("App", () => {
  it("renders loaded items and stats", async () => {
    mockedItemsApi.getItems.mockResolvedValue([
      { id: "1", name: "Milk", bought: false },
      { id: "2", name: "Bread", bought: true },
    ]);

    render(<App />);

    expect(await screen.findByText("Milk")).toBeInTheDocument();
    expect(screen.getByText("Bread")).toBeInTheDocument();
    expect(screen.getByText("2 items total")).toBeInTheDocument();
    expect(screen.getByText("1 purchased")).toBeInTheDocument();

    const boughtItem = screen.getByText("Bread");
    expect(boughtItem).toHaveStyle({ textDecoration: "line-through" });
  });

  it("creates new items from input", async () => {
    mockedItemsApi.createItem.mockResolvedValue({
      id: "3",
      name: "Apples",
      bought: false,
    });

    render(<App />);

    await screen.findByText("No items yet. Add your first product to get started.");

    const input = screen.getByLabelText("Product name");
    const button = screen.getByRole("button", { name: "Add item" });
    const user = userEvent.setup();

    await user.type(input, "  Apples  ");
    await user.click(button);

    await waitFor(() => {
      expect(mockedItemsApi.createItem).toHaveBeenCalledWith("Apples");
    });

    expect(await screen.findByText("Apples")).toBeInTheDocument();
  });

  it("toggles and deletes items", async () => {
    mockedItemsApi.getItems.mockResolvedValue([{ id: "1", name: "Tea", bought: false }]);
    mockedItemsApi.updateItem.mockResolvedValue({ id: "1", name: "Tea", bought: true });

    render(<App />);

    const checkbox = await screen.findByRole("checkbox", {
      name: "Mark Tea as purchased",
    });
    const user = userEvent.setup();

    await user.click(checkbox);
    await waitFor(() => {
      expect(mockedItemsApi.updateItem).toHaveBeenCalledWith("1", true);
    });

    const updatedItem = await screen.findByText("Tea");
    expect(updatedItem).toHaveStyle({ textDecoration: "line-through" });

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockedItemsApi.deleteItem).toHaveBeenCalledWith("1");
    });

    expect(screen.queryByText("Tea")).toBeNull();
  });

  it("shows a load error", async () => {
    mockedItemsApi.getItems.mockRejectedValue(new Error("Network error"));

    render(<App />);

    expect(await screen.findByText("Network error")).toBeInTheDocument();
  });
});
