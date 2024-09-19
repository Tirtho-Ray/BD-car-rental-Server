import { z } from 'zod';
import { CarTypes, FuelTypes, Statuses } from './car.constant';

// Define Zod enums using the imported constants
const CarTypeEnum = z.enum(CarTypes);
const FuelTypeEnum = z.enum(FuelTypes);
const StatusEnum = z.enum(Statuses);

// Define the validation schema for cars
const carValidationSchema = z.object({
  name: z.string().min(1).max(30),
  image: z.string().url(), // Assuming image URL validation
  carCode: z.string().min(1).max(10),
  featuresImage: z.array(z.string().url()).nonempty().max(3), // Assuming URL validation and non-empty array
  description: z.string().max(1000),
  color: z.string().min(1),
  features: z.array(z.string()).nonempty(),
  carType: CarTypeEnum,
  pricePerHour: z.number().positive(),
  status: StatusEnum.default("available"),
  isDeleted: z.boolean().default(false),
  extra: z.array(z.object({
    age: z.number().int().positive(),
    seats: z.number().int().positive(),
    largeBags: z.number().int().nonnegative(),
    smallBags: z.number().int().nonnegative(),
    engineCapacity: z.string().optional(),
    transmission: z.string().optional(),
    fuelType: FuelTypeEnum,
    fuelConsumption: z.string().optional(),
  })),
});


// Define the validation schema for updates
const carUpdateValidationSchema = z.object({
  name: z.string().min(1).optional(),
  image: z.string().url().optional(), // Assuming image URL validation
  featuresImage: z.array(z.string().url()).nonempty().optional(), // Optional with URL validation
  description: z.string().max(200).optional(),
  color: z.string().min(1).optional(),
  features: z.array(z.string()).nonempty().optional(),
  carType: CarTypeEnum.optional(),
  pricePerHour: z.number().positive().optional(),
  status: StatusEnum.optional(),
  isDeleted: z.boolean().optional(),
  extra:z.array( z.object({
    age: z.number().int().positive().optional(),
    seats: z.number().int().positive().optional(),
    largeBags: z.number().int().nonnegative().optional(),
    smallBags: z.number().int().nonnegative().optional(),
    engineCapacity: z.string().optional(),
    transmission: z.string().optional(),
    fuelType: FuelTypeEnum.optional(),
    fuelConsumption: z.string().optional(),
  })).optional(),
});

export const CarValidation = {
  carValidationSchema,
  carUpdateValidationSchema,
};
