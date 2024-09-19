import { Schema, model } from 'mongoose';
import { ExtraDetails, TCars } from './car.interface';



const ExtraDetailsSchema = new Schema<ExtraDetails>(
  {
    age: {
      type: Number,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    largeBags: {
      type: Number,
      required: true,
    },
    smallBags: {
      type: Number,
      required: true,
    },
    engineCapacity: {
      type: String
    },
    transmission: {
      type: String,
    },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Octane", "Ethanol"], // Match with TFuelType
      required: true,
    },
    fuelConsumption: {
      type: String,
    },
  },
  { _id: false } // Prevents Mongoose from creating _id fields for each subdocument
);

const CarsSchema = new Schema<TCars>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    carCode: {
      type: String,
      required: true,
      unique: true,
    },
    featuresImage: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    carType: {
      type: String,
      enum: ["Van", "4 Wheel drives", "Electric vehicles", "SUVs", "Small cars"], // Match with TCarTypes
      required: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "unavailable"], // Match with TStatus
      default: "available",
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    extra: {
      type: [ExtraDetailsSchema], // Array of ExtraDetailsSchema
     
    },
  },
  {
    timestamps: true,
  }
);

export const Cars = model<TCars>('cars', CarsSchema);
