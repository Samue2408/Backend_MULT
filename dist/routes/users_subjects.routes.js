"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_subjects_controller_1 = require("../controllers/users_subjects.controller");
const router = (0, express_1.Router)();
router.get('/', users_subjects_controller_1.getUsersSubjects);
router.get('/:id', users_subjects_controller_1.getUserSubject);
router.post('/', users_subjects_controller_1.postUserSubject);
router.put('/:id', users_subjects_controller_1.putUserSubject);
router.delete('/:id', users_subjects_controller_1.deleteUserSubject);
exports.default = router;
