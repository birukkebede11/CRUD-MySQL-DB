const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/", (req, res) => res.send("Up and running..."));
router.get("/create-table", customerController.createTables);
router.post("/insert-customers-info", customerController.insertCustomerInfo);
router.get("/customers-detail-info", customerController.getCustomersDetailInfo);
router.get("/customers", customerController.getCustomersInfo);
router.put("/update", customerController.updateName);
router.delete("/remove-user", customerController.deleteUser);

module.exports = router;
