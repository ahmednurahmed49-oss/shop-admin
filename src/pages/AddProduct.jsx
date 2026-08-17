import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ProductForm from "../components/ProductForm";
import { BackLink, PageHeader } from "../components/ui-kit";
import { useProducts } from "../hooks/useProducts";

function AddProduct() {
  const navigate = useNavigate();

  const { createProduct, saving } = useProducts();

  const handleSubmit = async (values) => {
    try {
      const created = await createProduct(values);

      toast.success("Product created successfully.");

      navigate(`/products/${created.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not create the product."
      );
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <BackLink to="/products">
        &larr; Back to Products
      </BackLink>

      <PageHeader
        title="Add Product"
        description="Create a new product in your store catalogue."
      />

      <ProductForm
        submitLabel="Save Product"
        busyLabel="Saving product..."
        saving={saving}
        onSubmit={handleSubmit}
        cancelTo="/products"
      />
    </div>
  );
}

export default AddProduct;