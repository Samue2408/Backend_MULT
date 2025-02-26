"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("../db/connection"));
const cors_1 = __importDefault(require("cors"));
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
        /*  this.app.use('/api/users', routesUsers),
         this.app.use('/api/cars', routesCars),
         this.app.use('/api/bookings', routesBookings),
         this.app.use('/api/favoritesCars', routesFavoritesCar) */
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
