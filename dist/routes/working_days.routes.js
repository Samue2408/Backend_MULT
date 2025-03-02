"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const working_days_controller_1 = require("../controllers/working_days.controller");
const router = (0, express_1.Router)();
router.get('/', working_days_controller_1.getWorkingDays);
exports.default = router;
