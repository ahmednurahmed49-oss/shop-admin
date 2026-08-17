import { Search } from "lucide-react";

/**
 * Live search input (filters as the administrator types).
 */
function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex-1">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>

      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />

      <input
        id="product-search"
        type="search"
        className="field pl-9"
        placeholder="Search products..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export default SearchBar;