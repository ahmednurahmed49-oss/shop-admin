import { Link, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/products/new", label: "Add Product" },
];

/**
 * Application header with responsive mobile menu and admin profile area.
 */
function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="ShopAdmin home"
        >
          <span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
            <ShoppingBag
              className="size-5"
              aria-hidden="true"
            />
          </span>

          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-foreground">
              ShopAdmin
            </span>

            <span className="hidden text-xs text-muted-foreground sm:block">
              E-Commerce Administration Portal
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              activeProps={{
                className: "bg-accent text-accent-foreground",
              }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="grid size-9 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
              AD
            </span>

            <span className="leading-tight">
              <span className="block text-sm font-medium text-foreground">
                Administrator
              </span>

              <span className="block text-xs text-muted-foreground">
                admin@shopadmin.co.ke
              </span>
            </span>
          </div>

          <button
            type="button"
            className="btn-secondary md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-t border-border bg-card px-4 py-2 md:hidden"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              activeProps={{
                className: "text-primary",
              }}
              className="block rounded-md px-2 py-3 text-sm font-medium text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Navbar;