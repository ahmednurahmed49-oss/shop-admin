import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { mockApi, renderApp } from "./test-utils";

describe("Add Product form", () => {
  it("renders all form fields", async () => {
    mockApi();

    renderApp("/products/new");

    expect(
      await screen.findByLabelText(/product name/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/description/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/price/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^category$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/stock quantity/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/sku/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/image url/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/product status/i)
    ).toBeInTheDocument();
  });

  it("rejects an empty submission and shows validation messages", async () => {
    const { calls } = mockApi();

    const user = userEvent.setup();

    renderApp("/products/new");

    await user.click(
      await screen.findByRole("button", {
        name: /save product/i,
      })
    );

    expect(
      await screen.findByText("Product name is required.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Description is required.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Price is required.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Category is required.")
    ).toBeInTheDocument();

    expect(
      calls.some((call) => call.method === "POST")
    ).toBe(false);
  });

  it("validates price and stock ranges", async () => {
    mockApi();

    const user = userEvent.setup();

    renderApp("/products/new");

    await user.type(
      await screen.findByLabelText(/product name/i),
      "Test Product"
    );

    await user.type(
      screen.getByLabelText(/description/i),
      "A test product."
    );

    await user.type(
      screen.getByLabelText(/price/i),
      "0"
    );

    await user.selectOptions(
      screen.getByLabelText(/^category$/i),
      "Home"
    );

    await user.type(
      screen.getByLabelText(/stock quantity/i),
      "-2"
    );

    await user.click(
      screen.getByRole("button", {
        name: /save product/i,
      })
    );

    expect(
      await screen.findByText(
        "Price must be greater than 0."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Stock cannot be negative.")
    ).toBeInTheDocument();
  });

  it("sends a POST request and navigates to the new product on success", async () => {
    const { calls } = mockApi();

    const user = userEvent.setup();

    renderApp("/products/new");

    await user.type(
      await screen.findByLabelText(/product name/i),
      "Test Product"
    );

    await user.type(
      screen.getByLabelText(/description/i),
      "A test product."
    );

    await user.type(
      screen.getByLabelText(/price/i),
      "5500"
    );

    await user.selectOptions(
      screen.getByLabelText(/^category$/i),
      "Home"
    );

    await user.type(
      screen.getByLabelText(/stock quantity/i),
      "10"
    );

    await user.type(
      screen.getByLabelText(/sku/i),
      "HM-TST-001"
    );

    await user.click(
      screen.getByRole("button", {
        name: /save product/i,
      })
    );

    await waitFor(() =>
      expect(
        calls.some((call) => call.method === "POST")
      ).toBe(true)
    );

    const post = calls.find(
      (call) => call.method === "POST"
    );

    expect(post?.body).toMatchObject({
      name: "Test Product",
      price: 5500,
      stock: 10,
      category: "Home",
    });

    // The newly created product should redirect
    // to its product details page.
    await waitFor(() =>
      expect(
        calls.some(
          (call) =>
            call.method === "GET" &&
            call.url.endsWith("/products/99")
        )
      ).toBe(true)
    );
  });
});