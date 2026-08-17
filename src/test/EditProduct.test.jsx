import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { mockApi, renderApp } from "./test-utils";

describe("Edit product", () => {
  it("loads the product and populates the form with existing values", async () => {
    mockApi();

    renderApp("/products/1/edit");

    const nameInput = await screen.findByLabelText(/product name/i);

    expect(nameInput).toHaveValue("Nike Air Max 270");
    expect(screen.getByLabelText(/price/i)).toHaveValue(12000);
    expect(screen.getByLabelText(/^category$/i)).toHaveValue("Shoes");
  });

  it("sends a PATCH request with the updated price and navigates to the details page", async () => {
    const { calls } = mockApi();

    const user = userEvent.setup();

    renderApp("/products/1/edit");

    const priceInput = await screen.findByLabelText(/price/i);

    await user.clear(priceInput);
    await user.type(priceInput, "13500");

    await user.click(
      screen.getByRole("button", {
        name: /save changes/i,
      })
    );

    await waitFor(() =>
      expect(
        calls.some((call) => call.method === "PATCH")
      ).toBe(true)
    );

    const patch = calls.find(
      (call) => call.method === "PATCH"
    );

    expect(patch?.url).toMatch(/\/products\/1$/);
    expect(patch?.body).toMatchObject({
      price: 13500,
    });

    expect(
      await screen.findByText("KES 13,500")
    ).toBeInTheDocument();
  });
});