"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const type_activities_controller_1 = require("../controllers/type_activities.controller");
const router = (0, express_1.Router)();
router.get('/', type_activities_controller_1.getTypeActivities);
router.get('/:id', type_activities_controller_1.getTypeActivity);
router.post('/', type_activities_controller_1.postTypeActivity);
router.put('/:id', type_activities_controller_1.putTypeActivity);
router.delete('/:id', type_activities_controller_1.deleteFaculty);
exports.default = router;
