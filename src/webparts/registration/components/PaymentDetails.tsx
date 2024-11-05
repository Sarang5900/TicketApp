import React from "react";
import { TextField } from "@fluentui/react";
import { IFormData } from "../../Types/formDataTypes";

interface IPaymentDetailsProps {
  formData: IFormData;
  setFormData: React.Dispatch<React.SetStateAction<IFormData>>;
  errors: { [key: string]: string };
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const PaymentDetails: React.FC<IPaymentDetailsProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
}) => {
  return (
    <div>
      <h3 style={{ textDecoration: "underline", textAlign: "center", fontWeight: "bold", textTransform: "uppercase" }}>
        Payment Details
      </h3>
      <TextField
        label="Card Number"
        placeholder="Enter card number."
        required
        type="number"
        value={formData.cardNumber ? formData.cardNumber.toString() : ''} // Convert number to string for display
        onChange={(e, newValue) => {
          const numericValue = newValue ? parseInt(newValue) : 0; // Convert to number
          setFormData({ ...formData, cardNumber: numericValue });

          // Clear error message when user changes the field
          setErrors((prev) => ({ ...prev, cardNumber: "" }));
        }}
        errorMessage={errors.cardNumber} // Display validation error
      />
      <TextField
        label="Expiry Date"
        placeholder="Enter Expiry date."
        required
        type="date"
        value={formData.expiryDate} // Controlled input for expiry date
        onChange={(e) => {
          const newValue = (e.target as HTMLInputElement).value;
          setFormData({ ...formData, expiryDate: newValue });

          // Clear error message when user changes the field
          setErrors((prev) => ({ ...prev, expiryDate: "" }));
        }}
        errorMessage={errors.expiryDate} // Display validation error
      />
      <TextField
        label="CVV"
        placeholder="Enter CVV number."
        required
        type="number"
        value={formData.cvv ? formData.cvv.toString() : ''} // Convert number to string for display
        onChange={(e, newValue) => {
          const numericValue = newValue ? parseInt(newValue) : 0; // Convert to number
          setFormData({ ...formData, cvv: numericValue });

          // Clear error message when user changes the field
          setErrors((prev) => ({ ...prev, cvv: "" }));
        }}
        errorMessage={errors.cvv} // Display validation error
      />
    </div>
  );
};

export default PaymentDetails;
