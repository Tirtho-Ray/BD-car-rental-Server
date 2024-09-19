import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { CarsController } from './car.controller';
import { CarValidation } from './car.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';


const router = express.Router();

 
router.post(
    '/create-cars',
    validateRequest(CarValidation.carValidationSchema),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    CarsController.createCars
  );
  
router.get('/cars', CarsController.getAllCars);
router.get('/cars/:id', CarsController.getSingleCars);
router.put('/cars/:id', validateRequest(CarValidation.carUpdateValidationSchema), auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), CarsController.updateCar);
router.delete('/cars/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), CarsController.deleteCar);
export const CarsRoutes = router;

