import { useCallback, useState } from "react";

/**
 * Controlled-form hook:
 * values, change handling, validation and reset.
 */
export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  }, []);

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  }, []);

  const reset = useCallback(
    (next) => {
      setValues(next ?? initialValues);
      setErrors({});
    },
    [initialValues]
  );

  const validateAll = useCallback(() => {
    const nextErrors = validate(values);

    setErrors(nextErrors);

    return Object.values(nextErrors).every(
      (value) => !value
    );
  }, [validate, values]);

  return {
    values,
    errors,
    handleChange,
    setValue,
    setValues,
    reset,
    validateAll,
  };
}