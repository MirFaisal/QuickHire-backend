const { Router } = require("express");
const { submitApplication } = require("./application.controller");
const { applicationSchema } = require("./application.validation");
const { validate } = require("../jobs/job.validation");

const router = Router();

router.post("/", validate(applicationSchema), submitApplication);

module.exports = router;
