
export type TFuelType = "Petrol" | "Diesel" | "Octane" | "Ethanol"|"electric";
export type TCarTypes = 
  "Van"|
  "4 Wheel drives"|
  "Electric vehicles"|
  "SUVs"|
  "Small cars"
;

export type TStatus = 'available' | 'unavailable'




// validations for
export const CarTypes = ["Van", "Wheel drives", "Electric vehicles", "SUVs", "Small cars"] as const;
export const FuelTypes = ["Petrol", "Diesel", "Octane", "Ethanol","electric"] as const;
export const Statuses = ["available", "unavailable"] as const;



// searchFor
export const carSearchableField = ['name', 'carCode', 'description',];
export const carFilter =['CarTypes']
export const carSortByPrice =['pricePerHour']

// http://localhost:5000/cars?searchTerm=Audi
// http://localhost:5000/cars?carType=suv
// http://localhost:5000/cars?minPrice=30&maxPrice=50