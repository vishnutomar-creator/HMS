const authService = require("../services/auth.service");

const {
  registerDTO,
  loginDTO,
} = require("../dto/auth.dto");

// REGISTER
const register = async (req, res, next) => {
  try {
    const data = registerDTO(req.body);

    const result =
      await authService.register(data);

    res.cookie("hms_session", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user: result.user },
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN
const login = async (req, res, next) => {
  try {
    const data = loginDTO(req.body);

    const result =
      await authService.login(
        data.email,
        data.password
      );

    res.cookie("hms_session", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user: result.user },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie("hms_session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return res.status(200).json({ success: true, message: "Logged out" });
};

// ME
const getMe = async (req, res, next) => {
  try {
    const user =
      await authService.getMe(
        req.user.userId
      );

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
