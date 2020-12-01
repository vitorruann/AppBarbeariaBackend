import { Router } from "express";
import multer from "multer";
import AppointmentController from "./app/controllers/AppointmentController";
import AvailableController from "./app/controllers/AvailableController";
import FileController from "./app/controllers/FileController";
import NotificationController from "./app/controllers/NotificationController";
import ProviderController from "./app/controllers/ProviderController";
import ScheduleController from "./app/controllers/ScheduleController";
import SessionController from "./app/controllers/SessionController";
import UserController from "./app/controllers/UserController";
import authMiddleware from "./app/middlewares/auth";
import multerConfig from "./config/multer";

const routes = new Router();
const upload = multer(multerConfig);
console.log('2');

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

//deve ser inserido antes das rotas que precisam de verificação
routes.use(authMiddleware);

routes.put("/users", UserController.update);

routes.get("/providers", ProviderController.index);
routes.get("/providers/:providerId/available", AvailableController.index);

routes.get("/appointments", AppointmentController.index);
routes.post("/appointments", AppointmentController.store);
routes.delete("/appointments/:id", AppointmentController.delete);

routes.get("/schedules", ScheduleController.index);

routes.get("/notifications", NotificationController.index);
routes.put("/notifications/:id", NotificationController.update);

routes.post("/files", upload.single("file"), FileController.store);

export default routes;
