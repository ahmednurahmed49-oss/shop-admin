import { CATEGORIES } from "../lib/seed-products";

export const STOCK_FILTERS = [
  "All",
  "In Stock",
  "Low Stock",
  "Out of Stock",
];

/**
 * Category + stock-status filters, combined with search
 * on the products page.
 */
function FilterBar({
  category,
  stock,
  onCategoryChange,
  onStockChange,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="sm:w-48">
        <label
          htmlFor="category-filter"
          className="sr-only"
        >
          Filter by category
        </label>

        <select
          id="category-filter"
          className="field"
          value={category}
          onChange={(event) =>
            onCategoryChange(event.target.value)
          }
        >
          <option value="All">
            All Categories
          </option>

          {CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:w-48">
        <label
          htmlFor="stock-filter"
          className="sr-only"
        >
          Filter by stock status
        </label>

        <select
          id="stock-filter"
          className="field"
          value={stock}
          onChange={(event) =>
            onStockChange(event.target.value)
          }
        >
          {STOCK_FILTERS.map((option) => (
            <option key={option} value={option}>
              {option === "All"
                ? "All Stock"
                : option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;