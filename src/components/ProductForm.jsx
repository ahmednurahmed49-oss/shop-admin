import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../lib/seed-products";
import { useForm } from "../hooks/useForm";

export const emptyProductForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  sku: "",
  image: "",
  status: "Active",
};

export const toFormValues = (product) => ({
  name: product.name,
  description: product.description,
  price: String(product.price),
  category: product.category,
  stock: String(product.stock),
  sku: product.sku,
  image: product.image,
  status: product.status,
});

/**
 * Client-side validation rules shared by the Add and Edit forms.
 */
export function validateProduct(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Product name is required.";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required.";
  }

  if (
    values.price.trim() === "" ||
    Number.isNaN(Number(values.price))
  ) {
    errors.price = "Price is required.";
  } else if (Number(values.price) <= 0) {
    errors.price = "Price must be greater than 0.";
  }

  if (!values.category) {
    errors.category = "Category is required.";
  }

  if (
    values.stock.trim() === "" ||
    Number.isNaN(Number(values.stock))
  ) {
    errors.stock = "Stock quantity is required.";
  } else if (Number(values.stock) < 0) {
    errors.stock = "Stock cannot be negative.";
  }

  if (
    values.sku.trim() &&
    !/^[A-Za-z0-9-]{3,20}$/.test(values.sku.trim())
  ) {
    errors.sku =
      "SKU may only contain letters, numbers and dashes (3-20 characters).";
  }

  return errors;
}

function ProductForm({
  initialValues = emptyProductForm,
  submitLabel,
  busyLabel,
  saving,
  onSubmit,
  cancelTo,
}) {
  const navigate = useNavigate();

  const {
    values,
    errors,
    handleChange,
    validateAll,
  } = useForm(initialValues, validateProduct);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateAll()) return;

    await onSubmit({
      name: values.name.trim(),

      description: values.description.trim(),

      price: Number(values.price),

      category: values.category,

      stock: Number(values.stock),

      sku: values.sku.trim(),

      image:
        values.image.trim() ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=70",

      status:
        values.status === "Draft"
          ? "Draft"
          : "Active",
    });
  };

  const fieldError = (key) =>
    errors[key] ? (
      <p
        id={`${key}-error`}
        role="alert"
        className="mt-1 text-xs font-medium text-destructive"
      >
        {errors[key]}
      </p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      {/* Basic Information */}
      <fieldset className="surface-card space-y-4 p-5">
        <legend className="px-1 text-sm font-semibold text-foreground">
          Basic Information
        </legend>

        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium"
          >
            Product Name
          </label>

          <input
            id="name"
            name="name"
            className="field"
            value={values.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={
              errors.name
                ? "name-error"
                : undefined
            }
          />

          {fieldError("name")}
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows={4}
            className="field"
            value={values.description}
            onChange={handleChange}
            aria-invalid={Boolean(
              errors.description
            )}
            aria-describedby={
              errors.description
                ? "description-error"
                : undefined
            }
          />

          {fieldError("description")}
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-1 block text-sm font-medium"
          >
            Category
          </label>

          <select
            id="category"
            name="category"
            className="field"
            value={values.category}
            onChange={handleChange}
            aria-invalid={Boolean(
              errors.category
            )}
            aria-describedby={
              errors.category
                ? "category-error"
                : undefined
            }
          >
            <option value="">
              Select a category
            </option>

            {CATEGORIES.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

          {fieldError("category")}
        </div>
      </fieldset>

      {/* Pricing & Inventory */}
      <fieldset className="surface-card grid gap-4 p-5 md:grid-cols-3">
        <legend className="px-1 text-sm font-semibold text-foreground">
          Pricing & Inventory
        </legend>

        <div>
          <label
            htmlFor="price"
            className="mb-1 block text-sm font-medium"
          >
            Price (KES)
          </label>

          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            className="field"
            value={values.price}
            onChange={handleChange}
            aria-invalid={Boolean(errors.price)}
            aria-describedby={
              errors.price
                ? "price-error"
                : undefined
            }
          />

          {fieldError("price")}
        </div>

        <div>
          <label
            htmlFor="stock"
            className="mb-1 block text-sm font-medium"
          >
            Stock Quantity
          </label>

          <input
            id="stock"
            name="stock"
            type="number"
            step="1"
            className="field"
            value={values.stock}
            onChange={handleChange}
            aria-invalid={Boolean(errors.stock)}
            aria-describedby={
              errors.stock
                ? "stock-error"
                : undefined
            }
          />

          {fieldError("stock")}
        </div>

        <div>
          <label
            htmlFor="sku"
            className="mb-1 block text-sm font-medium"
          >
            SKU
          </label>

          <input
            id="sku"
            name="sku"
            className="field"
            placeholder="NK-AM270-001"
            value={values.sku}
            onChange={handleChange}
            aria-invalid={Boolean(errors.sku)}
            aria-describedby={
              errors.sku
                ? "sku-error"
                : undefined
            }
          />

          {fieldError("sku")}
        </div>
      </fieldset>

      {/* Media & Status */}
      <fieldset className="surface-card grid gap-4 p-5 md:grid-cols-2">
        <legend className="px-1 text-sm font-semibold text-foreground">
          Media & Status
        </legend>

        <div>
          <label
            htmlFor="image"
            className="mb-1 block text-sm font-medium"
          >
            Image URL
          </label>

          <input
            id="image"
            name="image"
            className="field"
            placeholder="https://..."
            value={values.image}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-1 block text-sm font-medium"
          >
            Product Status
          </label>

          <select
            id="status"
            name="status"
            className="field"
            value={values.status}
            onChange={handleChange}
          >
            <option value="Active">
              Active
            </option>

            <option value="Draft">
              Draft
            </option>
          </select>
        </div>
      </fieldset>

      {/* Form Actions */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate(cancelTo)}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn-primary"
          disabled={saving}
        >
          {saving ? busyLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;