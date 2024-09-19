// car.interface.ts

import { TCarTypes,  TFuelType,  TStatus } from "./car.constant";

export interface ExtraDetails {
    age: number;
    seats: number;
    largeBags: number;
    smallBags: number;
    engineCapacity?: string;
    transmission?: string;
    fuelType: TFuelType;
    fuelConsumption?: string;
}

export interface TCars {
    name: string;
    image: string;
    carCode:string;
    featuresImage: string[];
    description: string;
    color: string;
    features: string[];
    carType: TCarTypes;
    pricePerHour: number;
    status: TStatus;
    isDeleted: boolean;
    extra: ExtraDetails[]; // Array of ExtraDetails
}
