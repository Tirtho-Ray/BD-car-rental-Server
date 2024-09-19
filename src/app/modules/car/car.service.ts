import QueryBuilder from "../../builder/queryBuilder";
import { carSearchableField } from "./car.constant";
import { TCars } from "./car.interface";
import { Cars } from "./car.model";

const createCarsIntoDB = async (payload: TCars) => {
  const cars = await Cars.create(payload);
  return cars;
};

// const getAllCarsIntoDB = async () =>{
//     const cars = await Cars.find();
//     return cars;
// }
const getAllCarsIntoDB = async (query: Record<string, unknown> = {}) => {
  const carQuery = new QueryBuilder(Cars.find(), query)
    .search(carSearchableField)  // Apply search
    .filter()           // Apply filter
    .sort();       // Apply sorting
  const cars = await carQuery.modelQuery.exec(); // Ensure query is executed
  return cars;
};

const getSingleCarsIntoDB = async (id:string) =>{
    const cars = await Cars.findById(id);
    return cars;
}

const updateCarIntoDB = async (id: string, payload: Partial<TCars>) => {
    const car = await Cars.findByIdAndUpdate(id, payload, { new: true });
    return car;
  }
  

  
  const deleteCarIntoDB = async (id: string) => {
    const car = await Cars.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return car;
  };
export const CarsServices = {
  createCarsIntoDB,
  getAllCarsIntoDB,
  getSingleCarsIntoDB,
  updateCarIntoDB,
  deleteCarIntoDB
};
