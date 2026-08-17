import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  mockApi,
  mockApiFailure,
  mockProducts,
  renderApp,
} from "./test-utils";

describe("Dashboard", () => {
  it("renders the welcome section and dynamically calculated statistics", async () => {
    mockApi();
    renderApp("/");

    expect(
      await screen.findByText(/welcome back, administrator/i)
    ).toBeInTheDocument();

    const stats = within(
      await screen.findByRole("region", {
        name: /store statistics/i,
      })
    );

    expect(stats.getByText("Total Products").parentElement).toHaveTextContent(
      "3"
    );

    expect(stats.getByText("In Stock").parentElement).toHaveTextContent(
      "1"
    );

    expect(stats.getByText("Low Stock").parentElement).toHaveTextContent(
      "1"
    );

    expect(stats.getByText("Out of Stock").parentElement).toHaveTextContent(
      "1"
    );
  });

  it("loads recent products from the API", async () => {
    mockApi();

    renderApp("/");

    expect(
      await screen.findByText("Nike Air Max 270")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Ceramic Coffee Mug Set")
    ).toBeInTheDocument();
  });

  it("shows a loading state while products are being fetched", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  status: 200,
                  json: async () => mockProducts,
                }),
              300
            )
          )
      )
    );

    renderApp("/");

    expect(
      await screen.findByText(/loading products/i)
    ).toBeInTheDocument();

    expect(
      await screen.findByText("Nike Air Max 270")
    ).toBeInTheDocument();
  });

  it("shows a friendly error state when the API is unavailable", async () => {
    mockApiFailure();

    renderApp("/");

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(/unable to reach the server/i);
  });

  it("navigates to the products page from the quick actions", async () => {
    mockApi();

    const user = userEvent.setup();

    renderApp("/");

    await screen.findByText("Nike Air Max 270");

    await user.click(
      screen.getByRole("link", {
        name: /view products/i,
      })
    );

    await waitFor(() =>
      expect(
        screen.getByText(/manage your store products/i)
      ).toBeInTheDocument()
    );
  });
});