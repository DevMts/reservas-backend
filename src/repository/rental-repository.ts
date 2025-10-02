export interface RentalRepository {
  create(data: RentalCreateInput): Promise<Rental>;
  findById(id: string): Promise<Rental | null>;
  delete(id: string): Promise<boolean>;
  update(id: string, data: Partial<Rental>): Promise<Rental | null>;
  findMany(): Promise<Rental[]>;
  findByUserId(id_user: string): Promise<Rental[]>;
  findByHouseId(id_house: string): Promise<Rental[]>;
  findByDateRange(check_in: Date, check_out: Date): Promise<Rental[]>;
  findByUserIdAndDateRange(id_user: string, check_in: Date, check_out: Date): Promise<Rental[]>;
  findByHouseIdAndDateRange(id_house: string, check_in: Date, check_out: Date): Promise<Rental[]>;
  findByUserIdAndHouseIdAndDateRange(id_user: string, id_house: string, check_in: Date, check_out: Date): Promise<Rental[]>;
}

export interface Rental {
  id: string;
  check_in: Date;
  check_out: Date;
  createdAt: Date;
  updatedAt: Date;
  id_user: string;
  id_house: string;
}

export interface RentalCreateInput {
  id?: string;
  check_in: Date;
  check_out: Date;
  createdAt?: Date;
  updatedAt?: Date;
  user: string;
  house: string;
}
