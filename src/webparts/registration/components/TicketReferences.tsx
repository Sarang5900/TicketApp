import React from "react";
import { Checkbox, Dropdown } from "@fluentui/react";
import { IFormData } from "../../Types/formDataTypes";

interface ITicketPreferencesProps {
  formData: IFormData;
  setFormData: React.Dispatch<React.SetStateAction<IFormData>>;
  errors: { [key: string]: string };
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const TicketPreferences: React.FC<ITicketPreferencesProps> = ({
  formData,
  setFormData,
  errors,
  setErrors, // Add setErrors here
}) => {
  const checkboxStyles = { root: { marginTop: "10px" } };

  return (
    <div>
      <h3
        style={{
          textDecoration: "underline",
          textAlign: "center",
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        Ticket Preferences
      </h3>
      <Dropdown
        label="Seat Type"
        placeholder="Select Seat Type."
        required
        options={[
          { key: "Sleeper", text: "Sleeper" },
          { key: "Seater", text: "Seater" },
          { key: "AC", text: "AC" },
          { key: "Non-AC", text: "Non-AC" },
        ]}
        selectedKey={formData.seatType}
        onChange={(e, option) => {
          const selectedSeatType = option?.key as string;

          setFormData({ ...formData, seatType: selectedSeatType });
      
          setErrors((prev) => ({
            ...prev,
            seatType: selectedSeatType ? "" : "Seat type is required.",
          }));
        }}
        errorMessage={errors.seatType}
      />

      <Checkbox
        label="Window Seat Preference"
        checked={formData.windowSeatPreference}
        onChange={(e, checked) =>
          setFormData({ ...formData, windowSeatPreference: checked || false })
        }
        styles={checkboxStyles} // Adding margin-top to the checkbox
      />

      <Dropdown
        label="Food Preference"
        placeholder="Select Food Prefrence."
        options={[
          { key: "Veg", text: "Vegetarian" },
          { key: "NonVeg", text: "Non-Vegetarian" },
        ]}
        selectedKey={formData.foodPreference}
        onChange={(e, option) =>
          setFormData({ ...formData, foodPreference: option?.key as string })
        }
      />

      <Checkbox
        label="Insurance Option"
        checked={formData.insuranceOption}
        onChange={(e, checked) =>
          setFormData({ ...formData, insuranceOption: checked || false })
        }
        styles={checkboxStyles} // Adding margin-top to the checkbox
      />
    </div>
  );
};

export default TicketPreferences;
