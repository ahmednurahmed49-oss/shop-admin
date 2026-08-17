import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  mockApi,
  mockApiFailure,
  renderApp,
} from "./test-utils";

describe("Product details", () => {
  it("fetches the product using the route id and renders its full record", async () => {
    const { calls } = mockApi();

    renderApp("/products/2");

    expect(
      await screen.findByRole("heading", {
        name: "Samsung Galaxy A55",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("KES 46,500")
    ).toBeInTheDocument();

    expect(
      screen.getByText("SM-A55-003")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Low Stock")
    ).toBeInTheDocument();

    expect(
      calls.some(
        (call) =>
          call.method === "GET" &&
          call.url.endsWith("/products/2")
      )
    ).toBe(true);
  });

  it("deletes the product after confirmation and returns to the products list", async () => {
    const { calls } = mockApi();

    const user = userEvent.setup();

    renderApp("/products/2");

    await screen.findByRole("heading", {
      name: "Samsung Galaxy A55",
    });

    await user.click(
      screen.getByRole("button", {
        name: /delete product/i,
      })
    );

    const dialog = await screen.findByRole("dialog");

    await user.click(
      within(dialog).getByRole("button", {
        name: /^delete$/i,
      })
    );

    await waitFor(() =>
      expect(
        calls.some(
          (call) =>
            call.method === "DELETE" &&
            call.url.endsWith("/products/2")
        )
      ).toBe(true)
    );

    expect(
      await screen.findByText(/manage your store products/i)
    ).toBeInTheDocument();
  });

  it("shows an error state when the product cannot be loaded", async () => {
    mockApiFailure();

    renderApp("/products/2");

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(/unable to reach the server/i);
  });
});