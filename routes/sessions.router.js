const { Router } = require("express");
const router = Router();

const currentUser = require("../controllers/sessions.controller");

router.get("/sessions/current", currentUser);

module.exports = router;