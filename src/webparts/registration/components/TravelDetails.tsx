import React from "react";
import { TextField, Dropdown, IDropdownOption } from "@fluentui/react";
import { IFormData } from "../../Types/formDataTypes";

interface ITravelDetailsProps {
  formData: IFormData;
  setFormData: React.Dispatch<React.SetStateAction<IFormData>>;
  errors: { [key: string]: string };
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const TravelDetails: React.FC<ITravelDetailsProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
}) => {
  const cityOptions: IDropdownOption[] = [
    { key: "Delhi", text: "Delhi" },
    { key: "Mumbai", text: "Mumbai" },
    { key: "Bangalore", text: "Bangalore" },
    { key: "Chennai", text: "Chennai" },
    { key: "Kolkata", text: "Kolkata" },
    { key: "Hyderabad", text: "Hyderabad" },
    { key: "Ahmedabad", text: "Ahmedabad" },
    { key: "Pune", text: "Pune" },
    { key: "Jaipur", text: "Jaipur" },
    { key: "Lucknow", text: "Lucknow" },
  ];

  const timeOptions: IDropdownOption[] = [
    { key: "08:00", text: "08:00 AM" },
    { key: "09:00", text: "09:00 AM" },
    { key: "10:00", text: "10:00 AM" },
    { key: "11:00", text: "11:00 AM" },
    { key: "12:00", text: "12:00 PM" },
    { key: "01:00", text: "01:00 PM" },
    { key: "02:00", text: "02:00 PM" },
    { key: "03:00", text: "03:00 PM" },
    { key: "04:00", text: "04:00 PM" },
    { key: "05:00", text: "05:00 PM" },
  ];

  const handleTravelDateChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    const date = newValue ? new Date(newValue) : undefined;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date && date < today) {
      setErrors((prev) => ({
        ...prev,
        travelDate: "Travel date cannot be in the past.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, travelDate: "" }));
      setFormData((prevData) => ({
        ...prevData,
        travelDate: date,
      }));
    }
  };

  const handleReturnDateChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    const date = newValue ? new Date(newValue) : undefined;
    const today = new Date();
    const travelDate = formData.travelDate;

    if (date && (date <= today || (travelDate && date <= travelDate))) {
      setErrors((prev) => ({
        ...prev,
        returnDate: "Return date should be after travel date and not the current date.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, returnDate: "" }));
      setFormData((prevData) => ({
        ...prevData,
        returnDate: date,
      }));
    }
  };

  const handleCityChange = (
    key: "departureCity" | "destinationCity",
    option?: IDropdownOption
  ): void => {
    const updatedFormData = { ...formData, [key]: option?.key as string };
    setFormData(updatedFormData);

    if (
      updatedFormData.departureCity &&
      updatedFormData.destinationCity &&
      updatedFormData.departureCity === updatedFormData.destinationCity
    ) {
      setErrors((prev) => ({
        ...prev,
        departureCity: "Departure and Destination cannot be the same.",
        destinationCity: "Departure and Destination cannot be the same.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        departureCity: "",
        destinationCity: "",
      }));
    }
  };

  const handleTravelTimeChange = (option?: IDropdownOption): void => {
    const travelTime = option?.key as string;

    setFormData((prevData) => ({ ...prevData, travelTime }));

    if (travelTime) {
      setErrors((prev) => ({ ...prev, travelTime: "" })); // Clear the error when a value is selected
    } else {
      setErrors((prev) => ({ ...prev, travelTime: "Travel time is required." }));
    }
  };

  return (
    <div>
      <h3 style={{textDecoration: "underline", textAlign: "center", fontWeight: "bold", textTransform: "uppercase" }}>
        Travel Details
      </h3>
      <Dropdown
        label="Departure City"
        placeholder="Select Departure City."
        options={cityOptions}
        selectedKey={formData.departureCity}
        required
        onChange={(e, option) => handleCityChange("departureCity", option)}
        errorMessage={errors.departureCity}
      />
      <Dropdown
        label="Destination City"
        placeholder="Select Destination City."
        options={cityOptions}
        selectedKey={formData.destinationCity}
        required
        onChange={(e, option) => handleCityChange("destinationCity", option)}
        errorMessage={errors.destinationCity}
      />
      <TextField
        label="Travel Date"
        placeholder="Select Travel Date."
        required
        type="date"
        value={formData.travelDate ? formData.travelDate.toISOString().split("T")[0] : ""}
        onChange={handleTravelDateChange}
        errorMessage={errors.travelDate}
      />
      <TextField
        label="Return Date"
        placeholder="Select Return Date."
        type="date"
        value={formData.returnDate ? formData.returnDate.toISOString().split("T")[0] : ""}
        onChange={handleReturnDateChange}
        errorMessage={errors.returnDate}
      />
      <Dropdown
        label="Travel Time"
        placeholder="Select Travel Time."
        options={timeOptions}
        required
        selectedKey={formData.travelTime}
        onChange={(e, option) => handleTravelTimeChange(option)}
        errorMessage={errors.travelTime}
      />
    </div>
  );
};

export default TravelDetails;
