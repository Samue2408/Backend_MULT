"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("../db/connection"));
const cors_1 = __importDefault(require("cors"));
const users_routes_1 = __importDefault(require("../routes/users.routes"));
const roles_routes_1 = __importDefault(require("../routes/roles.routes"));
const working_days_routes_1 = __importDefault(require("../routes/working_days.routes"));
const groups_routes_1 = __importDefault(require("../routes/groups.routes"));
const faculties_routes_1 = __importDefault(require("../routes/faculties.routes"));
const type_activities_routes_1 = __importDefault(require("../routes/type_activities.routes"));
const items_routes_1 = __importDefault(require("../routes/items.routes"));
const subjects_routes_1 = __importDefault(require("../routes/subjects.routes"));
const users_subjects_routes_1 = __importDefault(require("../routes/users_subjects.routes"));
const work_plans_routes_1 = __importDefault(require("../routes/work_plans.routes"));
const work_plans_items_routes_1 = __importDefault(require("../routes/work_plans_items.routes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '4000';
        this.middlewares();
        this.routes();
        this.conectDB();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("Aplicacion corriendo por el puerto: ", this.port);
        });
    }
    middlewares() {
        //Parseo del JSON - para que cuando se recibe un json lo convierta a objeto
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
    }
    routes() {
        this.app.use('/api/users', users_routes_1.default),
            this.app.use('/api/roles', roles_routes_1.default),
            this.app.use('/api/working_days', working_days_routes_1.default),
            this.app.use('/api/groups', groups_routes_1.default),
            this.app.use('/api/faculties', faculties_routes_1.default),
            this.app.use('/api/type_activities', type_activities_routes_1.default),
            this.app.use('/api/items', items_routes_1.default),
            this.app.use('/api/subjects', subjects_routes_1.default),
            this.app.use('/api/users_subjects', users_subjects_routes_1.default),
            this.app.use('/api/work_plans', work_plans_routes_1.default),
            this.app.use('/api/work_plans_items', work_plans_items_routes_1.default);
    }
    conectDB() {
        connection_1.default.connect((error) => {
            if (error)
                throw error;
            console.log('succesfull database conection');
        });
    }
}
exports.default = Server;
