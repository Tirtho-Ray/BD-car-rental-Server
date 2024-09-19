import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown> = {}) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // Method to apply search term
  search(searchableFields: string[]): this {
    const searchTerm = this.query.searchTerm as string;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  // Method to apply filters

  // Method to apply filters
filter(): this {
  const queryObject = { ...this.query };
  const excludeFields = ['searchTerm', 'sort', 'sortByPrice', 'minPrice', 'maxPrice'];
  excludeFields.forEach((el) => delete queryObject[el]);

  // Add price range filtering
  const minPrice = this.query.minPrice as number;
  const maxPrice = this.query.maxPrice as number;

  if (minPrice !== undefined && maxPrice !== undefined) {
      this.modelQuery = this.modelQuery.find({
          ...queryObject,
          pricePerHour: { $gte: minPrice, $lte: maxPrice }
      } as FilterQuery<T>);
  } else {
      this.modelQuery = this.modelQuery.find(queryObject as FilterQuery<T>);
  }

  return this;
}


  // Method to apply sorting
  sort(): this {
    const sortByPrice = this.query.sortByPrice as string;
    // console.log('Sort By Price:', sortByPrice); // Debugging fucking completed
    
    if (sortByPrice) {
        this.modelQuery = this.modelQuery.sort({
            pricePerHour: sortByPrice === 'low' ? 1 : -1,
        });
    } else {
        this.modelQuery = this.modelQuery.sort('-createdAt'); // Default sort
    }
    
    // console.log('Final Query:', this.modelQuery.getQuery());
    return this;
}


}


  



export default QueryBuilder;
