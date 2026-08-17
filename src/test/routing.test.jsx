import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { mockApi, renderApp } from "./test-utils";

describe("Client-side routing", () => {
  it("renders the dashboard at /", async () => {
    mockApi();
    renderApp("/");

    expect(
      await screen.findByText(/welcome back, administrator/i)
    ).toBeInTheDocument();
  });

  it("renders the products list at /products", async () => {
    mockApi();
    renderApp("/products");

    expect(
      await screen.findByRole("heading", {
        name: "Products",
        level: 1,
      })
    ).toBeInTheDocument();
  });

  it("renders the add product page at /products/new", async () => {
    mockApi();
    renderApp("/products/new");

    expect(
      await screen.findByRole("heading", {
        name: /add product/i,
        level: 1,
      })
    ).toBeInTheDocument();
  });

  it("renders product details at /products/:id", async () => {
    mockApi();
    renderApp("/products/1");

    expect(
      await screen.findByRole("heading", {
        name: "Nike Air Max 270",
      })
    ).toBeInTheDocument();
  });

  it("renders the edit page at /products/:id/edit", async () => {
    mockApi();
    renderApp("/products/1/edit");

    expect(
      await screen.findByRole("heading", {
        name: /edit product/i,
      })
    ).toBeInTheDocument();
  });

  it("renders the 404 page for an unknown route", async () => {
    mockApi();
    renderApp("/does-not-exist");

    expect(
      await screen.findByText("404")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/page not found/i)
    ).toBeInTheDocument();
  });

  it("navigates between pages without a full reload using the navbar", async () => {
    mockApi();

    const user = userEvent.setup();

    renderApp("/");

    await screen.findByText(
      /welcome back, administrator/i
    );

    const nav = screen.getByRole("navigation", {
      name: /main navigation/i,
    });

    await user.click(
      within(nav).getByRole("link", {
        name: "Products",
      })
    );

    await waitFor(() =>
      expect(
        screen.getByText(/manage your store products/i)
      ).toBeInTheDocument()
    );
  });
});