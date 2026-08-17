import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { mockApi, renderApp } from "./test-utils";

describe("Products page", () => {
  it("renders every product returned by the API with action buttons", async () => {
    mockApi();
    renderApp("/products");

    expect(await screen.findByText("Nike Air Max 270")).toBeInTheDocument();
    expect(screen.getByText("Samsung Galaxy A55")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /view nike air max 270/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /edit nike air max 270/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /delete nike air max 270/i })
    ).toBeInTheDocument();
  });

  it("filters products as the administrator types (case-insensitive)", async () => {
    mockApi();
    const user = userEvent.setup();

    renderApp("/products");

    await screen.findByText("Nike Air Max 270");

    await user.type(
      screen.getByRole("searchbox", { name: /search products/i }),
      "nike"
    );

    expect(screen.getByText("Nike Air Max 270")).toBeInTheDocument();
    expect(
      screen.queryByText("Samsung Galaxy A55")
    ).not.toBeInTheDocument();

    await user.clear(
      screen.getByRole("searchbox", { name: /search products/i })
    );

    await user.type(
      screen.getByRole("searchbox", { name: /search products/i }),
      "SAMSUNG"
    );

    expect(screen.getByText("Samsung Galaxy A55")).toBeInTheDocument();
    expect(
      screen.queryByText("Nike Air Max 270")
    ).not.toBeInTheDocument();
  });

  it("shows a no-results empty state and can clear the filters", async () => {
    mockApi();
    const user = userEvent.setup();

    renderApp("/products");

    await screen.findByText("Nike Air Max 270");

    await user.type(
      screen.getByRole("searchbox", { name: /search products/i }),
      "zzzz"
    );

    expect(screen.getByText(/no products found/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /clear filters/i })
    );

    expect(
      await screen.findByText("Nike Air Max 270")
    ).toBeInTheDocument();
  });

  it("filters by category and by stock status", async () => {
    mockApi();
    const user = userEvent.setup();

    renderApp("/products");

    await screen.findByText("Nike Air Max 270");

    await user.selectOptions(
      screen.getByLabelText(/filter by category/i),
      "Electronics"
    );

    expect(screen.getByText("Samsung Galaxy A55")).toBeInTheDocument();
    expect(
      screen.queryByText("Nike Air Max 270")
    ).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByLabelText(/filter by category/i),
      "All"
    );

    await user.selectOptions(
      screen.getByLabelText(/filter by stock status/i),
      "Out of Stock"
    );

    expect(
      screen.getByText("Ceramic Coffee Mug Set")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Samsung Galaxy A55")
    ).not.toBeInTheDocument();
  });

  it("deletes a product only after confirmation", async () => {
    const { calls } = mockApi();
    const user = userEvent.setup();

    renderApp("/products");

    await screen.findByText("Nike Air Max 270");

    // Cancel keeps the product.
    await user.click(
      screen.getByRole("button", {
        name: /delete nike air max 270/i,
      })
    );

    const dialog = await screen.findByRole("dialog");

    expect(
      within(dialog).getByText(/delete nike air max 270\?/i)
    ).toBeInTheDocument();

    await user.click(
      within(dialog).getByRole("button", {
        name: /cancel/i,
      })
    );

    expect(
      screen.getByText("Nike Air Max 270")
    ).toBeInTheDocument();

    expect(
      calls.some((c) => c.method === "DELETE")
    ).toBe(false);

    // Confirm removes it through DELETE.
    await user.click(
      screen.getByRole("button", {
        name: /delete nike air max 270/i,
      })
    );

    const confirmDialog = await screen.findByRole("dialog");

    await user.click(
      within(confirmDialog).getByRole("button", {
        name: /^delete$/i,
      })
    );

    await waitFor(() =>
      expect(
        screen.queryByText("Nike Air Max 270")
      ).not.toBeInTheDocument()
    );

    expect(
      calls.some(
        (c) =>
          c.method === "DELETE" &&
          c.url.endsWith("/products/1")
      )
    ).toBe(true);
  });
});