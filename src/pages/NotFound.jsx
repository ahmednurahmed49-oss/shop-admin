import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-foreground">
        404
      </h1>

      <p className="mt-3 text-lg text-muted-foreground">
        Page not found.
      </p>

      <Link to="/" className="btn-primary mt-6">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;