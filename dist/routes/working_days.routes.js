"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const working_days_controller_1 = require("../controllers/working_days.controller");
const router = (0, express_1.Router)();
router.get('/', working_days_controller_1.getWorkingDays);
router.get('/:id', working_days_controller_1.getWorkingDay);
router.post('/', working_days_controller_1.postWorkingDay);
router.put('/:id', working_days_controller_1.putWorkingDay);
router.delete('/:id', working_days_controller_1.deletedWorkingDay);
exports.default = router;
