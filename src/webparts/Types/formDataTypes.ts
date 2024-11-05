export interface IFormData {
  id:string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender: string;
  age?: number;
  departureCity: string;
  destinationCity: string;
  travelDate: Date | undefined;
  returnDate: Date | undefined;
  travelTime: string;
  numberOfPassengers: number;
  passengerNames: string[];
  passengerAges: (number | undefined)[];
  identityProof: string;
  identityProofNumber: string;
  seatType: string;
  windowSeatPreference: boolean;
  foodPreference: string;
  insuranceOption: boolean;
  cardNumber: number;
  expiryDate: string;
  cvv: number;
  additionalInfo: string;
  uploadedFile?: File;
}
