const registerDTO = (data) => {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone || "",
    password: data.password,
    // Public registration can only create patients. Staff accounts must be
    // provisioned through an authenticated administration workflow.
    role: "patient",
  };
};

const loginDTO = (data) => {
  return {
    email: data.email,
    password: data.password,
  };
};

const userResponseDTO = (user) => {
  const role = String(user.role || "").toUpperCase();
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};

module.exports = {
  registerDTO,
  loginDTO,
  userResponseDTO,
};
