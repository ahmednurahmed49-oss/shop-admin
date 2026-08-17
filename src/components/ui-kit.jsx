import { Link } from "react-router-dom";
import { AlertTriangle, Loader2, PackageSearch } from "lucide-react";
import { cn } from "../lib/utils";
import { getStockStatus } from "../lib/format";

/**
 * Small shared presentational building blocks used across every page.
 */

export function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-16"
    >
      <Loader2
        className="size-7 animate-spin text-primary"
        aria-hidden="true"
      />

      <p className="text-sm text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center"
    >
      <AlertTriangle
        className="size-6 text-destructive"
        aria-hidden="true"
      />

      <p className="text-sm font-medium text-foreground">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn-secondary"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}) {
  return (
    <div className="surface-card flex flex-col items-center gap-3 p-12 text-center">
      <PackageSearch
        className="size-8 text-muted-foreground"
        aria-hidden="true"
      />

      <h3 className="text-base font-semibold text-foreground">
        {title}
      </h3>

      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {action}
    </div>
  );
}

export function StockBadge({ stock }) {
  const status = getStockStatus(stock);

  const styles =
    status === "In Stock"
      ? "bg-success/12 text-success"
      : status === "Low Stock"
        ? "bg-warning/20 text-warning-foreground"
        : "bg-destructive/10 text-destructive";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        styles
      )}
    >
      {status}
    </span>
  );
}

export function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "Active"
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      )}
    >
      {status}
    </span>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/12 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <article className="surface-card flex items-center gap-4 p-5">
      <span
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-lg",
          tones[tone]
        )}
      >
        <Icon className="size-5" />
      </span>

      <span className="min-w-0">
        <span className="block text-sm text-muted-foreground">
          {label}
        </span>

        <span className="block text-2xl font-semibold text-foreground">
          {value}
        </span>
      </span>
    </article>
  );
}

export function PageHeader({
  title,
  description,
  action,
}) {
  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {action}
    </header>
  );
}

export function BackLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-sm font-medium text-primary hover:underline"
    >
      {children}
    </Link>
  );
}