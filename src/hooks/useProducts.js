import { useCallback, useState } from "react";
import * as productService from "../services/productService";
import { useFetch } from "./useFetch";

/**
 * Single source of truth for product data + CRUD.
 * Every mutation goes through the service layer.
 */
export function useProducts() {
  const {
    data,
    loading,
    error,
    refetch,
    setData,
  } = useFetch(productService.getProducts, []);

  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState(null);

  const products = data ?? [];

  const createProduct = useCallback(
    async (values) => {
      setSaving(true);
      setActionError(null);

      try {
        const created = await productService.createProduct(values);

        setData((prev) => [
          created,
          ...(prev ?? []),
        ]);

        return created;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Could not create the product.";

        setActionError(message);
        throw new Error(message);
      } finally {
        setSaving(false);
      }
    },
    [setData]
  );

  const updateProduct = useCallback(
    async (id, changes) => {
      setSaving(true);
      setActionError(null);

      try {
        const updated =
          await productService.updateProduct(
            id,
            changes
          );

        setData((prev) =>
          (prev ?? []).map((product) =>
            String(product.id) === String(id)
              ? updated
              : product
          )
        );

        return updated;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Could not update the product.";

        setActionError(message);
        throw new Error(message);
      } finally {
        setSaving(false);
      }
    },
    [setData]
  );

  const deleteProduct = useCallback(
    async (id) => {
      setSaving(true);
      setActionError(null);

      try {
        await productService.deleteProduct(id);

        setData((prev) =>
          (prev ?? []).filter(
            (product) =>
              String(product.id) !== String(id)
          )
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Could not delete the product.";

        setActionError(message);
        throw new Error(message);
      } finally {
        setSaving(false);
      }
    },
    [setData]
  );

  return {
    products,
    loading,
    error,
    saving,
    actionError,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: refetch,
  };
}