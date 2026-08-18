import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { formatKES } from "../lib/format";
import { StockBadge } from "./ui-kit";

function ProductCard({ product, onDelete }) {
  return (
    <article className="surface-card flex h-full flex-col overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className="h-44 w-full bg-muted object-cover"
      />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-foreground">
            {product.name}
          </h3>

          <StockBadge stock={product.stock} />
        </div>

        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.category}
        </p>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-foreground">
            {formatKES(product.price)}
          </span>

          <span className="text-sm text-muted-foreground">
            {product.stock} in stock
          </span>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border pt-3">
          <Link
            to={`/products/${product.id}`}
            className="btn-secondary flex-1"
            aria-label={`View ${product.name}`}
          >
            <Eye className="size-4" aria-hidden="true" />
            View
          </Link>

          <Link
            to={`/products/${product.id}/edit`}
            className="btn-secondary flex-1"
            aria-label={`Edit ${product.name}`}
          >
            <Pencil className="size-4" aria-hidden="true" />
            Edit
          </Link>

          <button
            type="button"
            onClick={() => onDelete(product)}
            className="btn-danger"
            aria-label={`Delete ${product.name}`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;