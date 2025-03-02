"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkingDays = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const getWorkingDays = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    connection_1.default.query(`
        SELECT 
            wd.working_day_id AS working_day_id,
            wd.name AS working_day_name
        FROM working_days wd
    `, [], (error, data) => {
        if (error)
            console.error("Error database details: " + error.message);
        res.json(data.rows);
    });
});
exports.getWorkingDays = getWorkingDays;
