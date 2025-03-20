import express, {Application} from 'express';
import pool from '../db/connection';
import cors from 'cors';
import routesUsers from '../routes/users.routes';
import routesRoles from '../routes/roles.routes';
import routerWorkingDays from '../routes/working_days.routes';
import routerGroups from '../routes/groups.routes';
import routerFaculties from '../routes/faculties.routes';
import routerTypeActivities from '../routes/type_activities.routes';
import routerItems from '../routes/items.routes';
import routerSubjects from '../routes/subjects.routes';

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '4000';
        this.middlewares();
        this.routes();
        this.conectDB();
    }

    listen() {
        this.app.listen(this.port, ()=>{
            console.log("Aplicacion corriendo por el puerto: ", this.port)
        })
    }

    middlewares(){
        //Parseo del JSON - para que cuando se recibe un json lo convierta a objeto
        this.app.use(express.json());
        this.app.use(cors());
    }

    routes(){
        this.app.use('/api/users', routesUsers),
        this.app.use('/api/roles', routesRoles),
        this.app.use('/api/working_days', routerWorkingDays),
        this.app.use('/api/groups', routerGroups),
        this.app.use('/api/faculties', routerFaculties),
        this.app.use('/api/type_activities', routerTypeActivities),
        this.app.use('/api/items', routerItems),
        this.app.use('/api/subjects', routerSubjects)
    }

    conectDB(){
        pool.connect((error) => {
            if(error) throw error;
            console.log('succesfull database conection')
        })
    }
}

export default Server;
