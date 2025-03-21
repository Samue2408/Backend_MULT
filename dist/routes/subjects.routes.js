"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subjects_controller_1 = require("../controllers/subjects.controller");
const router = (0, express_1.Router)();
router.get('/', subjects_controller_1.getSubjects);
router.get('/:id', subjects_controller_1.getSubject);
router.post('/', subjects_controller_1.postSubject);
router.put('/:id', subjects_controller_1.putSubject);
router.delete('/:id', subjects_controller_1.deleteSubject);
exports.default = router;
