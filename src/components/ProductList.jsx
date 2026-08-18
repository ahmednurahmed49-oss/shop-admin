import ProductCard from "./ProductCard";

/**
 * Responsive product grid:
 * 1 column on mobile,
 * 2 on tablet,
 * 3 on desktop.
 */
function ProductList({ products, onDelete }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}

export default ProductList;