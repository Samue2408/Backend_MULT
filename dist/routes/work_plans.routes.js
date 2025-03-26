"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const work_plans_controller_1 = require("../controllers/work_plans.controller");
const router = (0, express_1.default)();
router.get('/', work_plans_controller_1.getWorkPlans);
router.get('/:id', work_plans_controller_1.getWorkPlan);
router.post('/', work_plans_controller_1.postWorkPlan);
router.put('/:id', work_plans_controller_1.putWorkPlan);
router.delete('/:id', work_plans_controller_1.deleteWorkPlan);
exports.default = router;
