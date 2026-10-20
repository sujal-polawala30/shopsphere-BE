
function validateProduct(data) {
  const errors = [];

  if (
    typeof data.name !== "string" ||
    data.name.trim().length === 0
  ) {
    errors.push("Product name is required");
  } else if (data.name.trim().length > 150) {
    errors.push("Product name cannot exceed 150 characters");
  }

  if (
    data.price === undefined ||
    data.price === null ||
    data.price === "" ||
    !Number.isFinite(Number(data.price)) ||
    Number(data.price) <= 0
  ) {
    errors.push("Price must be a positive number");
  }

  return errors;
}

module.exports = { validateProduct };
