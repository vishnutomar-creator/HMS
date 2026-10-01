// const express = require("express");

// const {
//   createNurse,
//   getNurses,
//   getNurseById,
//   updateNurse,
//   deleteNurse,
//   getNursesByWard,
// } = require("../controllers/nurses.controller");

// // const { validationMiddleware } = require("../middlewares/validation.middleware");
// const {
//   createNurseValidator,
//   updateNurseValidator,
//   nurseIdValidator,
// } = require("../validators/nurses.validator");
// const upload = require("../middlewares/upload.middleware");

// const router = express.Router();

// // router.post("/createnurse", upload.single("profileImage"), createNurseValidator, validationMiddleware, createNurse);
// router.get("/getnurses", getNurses);
// router.get("/getnurseby/:id", nurseIdValidator, validationMiddleware, getNurseById);
// router.get("/getnursesbyward/:wardId", getNursesByWard);
// router.put("/updatenurseby/:id", upload.single("profileImage"), updateNurseValidator, validationMiddleware, updateNurse);
// router.delete("/deletenurseby/:id", nurseIdValidator, validationMiddleware, deleteNurse);

// module.exports = router;