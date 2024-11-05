import React from "react";
import { TextField, Dropdown, IDropdownOption } from "@fluentui/react";
import { IFormData } from "../../Types/formDataTypes";

interface IUserInformationProps {
  formData: IFormData;
  setFormData: React.Dispatch<React.SetStateAction<IFormData>>;
  errors: { [key: string]: string };
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const UserInfo: React.FC<IUserInformationProps> = ({ formData, setFormData, errors, setErrors }) => {

  const genderOption: IDropdownOption[] = [
    { key: "Male", text: "Male" },
    { key: "Female", text: "Female" },
    { key: "Other", text: "Other" },
  ];

  // Capitalize the first letter of each word and make the rest lowercase
  const formatName = (value: string): string => {

    const words = value.split(" ");

    const formattedWords = words.map(word => {

      if (word.length > 0) {
        
        const firstLetter = word.charAt(0).toUpperCase(); 
        const restOfWord = word.slice(1).toLowerCase(); 
        return firstLetter + restOfWord; 
      }
      return word; 
    });
  
    return formattedWords.join(" ");
  };

  const validateFullName = (value: string): string => {
    if (!value) {
      return "Please enter your full name.";
    } else if (!value.trim()) {
      return "Name should not be empty or consist only of spaces.";
    }
    return "";
  };

  const validateEmail = (value: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      return "Please enter your email.";
    } else if (!emailRegex.test(value.trim().toLowerCase())) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePhoneNumber = (value: string): string => {
    const phoneRegex = /^\d{10}$/;
    if (!value.trim()) {
      return "Phone number is required";
    } else if (!phoneRegex.test(value)) {
      return "Phone number must be exactly 10 digits";
    } else if (value.trim()[0] === "0") {
      return "Phone number should not start with 0.";
    }
    return "";
  };

  const validateAge = (value: string): string => {
    const ageNum = Number(value);
    if (!value.trim()) {
      return "Age is required";
    } else if (isNaN(ageNum) || ageNum <= 0 || ageNum > 100) {
      return "Please enter a valid age.";
    }
    return "";
  };

  const validatePassword = (value: string): string => {
    const errors = [];
    if (value.trim().length < 8 || value.trim().length > 16) {
      errors.push("Password must be 8-16 characters long.");
    }
    if (!/[a-z]/.test(value.trim())) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[A-Z]/.test(value.trim())) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/\d/.test(value.trim())) {
      errors.push("Password must contain at least one digit.");
    }
    if (!/[!@#$%^&*]/.test(value.trim())) {
      errors.push("Password must contain at least one special character.");
    }
    return errors.join("\n");
  };

  // Handle changes in Full Name with capitalization
  const handleFullNameChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ): void => {
    const formattedName = formatName(newValue || "");
    const errorMsg = validateFullName(formattedName);
    setErrors((prev) => ({ ...prev, fullName: errorMsg }));
    setFormData((prev) => ({ ...prev, fullName: formattedName }));
  };

  // Handle changes in Email, trimming spaces while typing
  const handleEmailChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ): void => {
    const trimmedEmail = newValue?.replace(/\s+/g, "") || "";
    const errorMsg = validateEmail(trimmedEmail);
    setErrors((prev) => ({ ...prev, email: errorMsg }));
    setFormData((prev) => ({ ...prev, email: trimmedEmail }));
  };

  // Handle changes in Phone Number
  const handlePhoneNumberChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ): void => {
    const errorMsg = validatePhoneNumber(newValue || "");
    setErrors((prev) => ({ ...prev, phoneNumber: errorMsg }));
    setFormData((prev) => ({ ...prev, phoneNumber: newValue || "" }));
  };

  // Handle changes in Age
  const handleAgeChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ): void => {
    const errorMsg = validateAge(newValue || "");
    setErrors((prev) => ({ ...prev, age: errorMsg }));
  
    // Update form data only if the new value is not empty
    if (newValue) {
      setFormData((prev) => ({
        ...prev,
        age: Number(newValue), // Set age as number if input is provided
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        age: undefined, // Set to undefined if empty
      }));
    }
  };
  // Handle changes in Password, trimming spaces while typing
  const handlePasswordChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ): void => {
    const trimmedPassword = newValue?.replace(/\s+/g, "") || "";
    const errorMsg = validatePassword(trimmedPassword);
    setErrors((prev) => ({ ...prev, password: errorMsg }));
    setFormData((prev) => ({ ...prev, password: trimmedPassword }));
  };

  // Handle changes in Gender
  const handleGenderChange = (option?: IDropdownOption): void => {
    setFormData((prev) => ({ ...prev, gender: option?.key as string }));
    setErrors((prev) => ({ ...prev, gender: option ? "" : "Gender is required." }));
  };

  // Function to prevent non-alphabetic characters in Full Name
  const handleFullNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const invalidChars = /[^a-zA-Z\s]/;
    if (invalidChars.test(e.key)) {
      e.preventDefault();
    }
  };

  // Function to allow only numeric input for Phone Number
  const handlePhoneNumberKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const invalidChars = /[^0-9]/; // Allow only digits
    if (invalidChars.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <h3 style={{textDecoration: "underline", textAlign: "center", fontWeight: "bold", textTransform: "uppercase" }}>
        User Information
      </h3>
      <TextField
        label="Full Name"
        placeholder="Enter your full name."
        required
        value={formData.fullName}
        onChange={handleFullNameChange}
        onKeyPress={handleFullNameKeyPress} // Prevent invalid keypress
        errorMessage={errors.fullName}
      />
      <TextField
        label="Age"
        placeholder="Enter your age."
        required
        type="number"
        value={formData.age !== undefined ? formData.age.toString() : ""}
        onChange={handleAgeChange}
        errorMessage={errors.age}
      />
      <TextField
        label="Email Address"
        placeholder="Enter your email address."
        required
        type="email"
        value={formData.email}
        onChange={handleEmailChange}
        errorMessage={errors.email}
      />
      <TextField
        label="Password"
        placeholder="Enter your password."
        required
        type="password"
        value={formData.password}
        onChange={handlePasswordChange}
        errorMessage={errors.password}
        canRevealPassword
        revealPasswordAriaLabel="Show Password"
      />
      <TextField
        label="Phone Number"
        placeholder="Enter your phone number."
        required
        value={formData.phoneNumber}
        onChange={handlePhoneNumberChange}
        onKeyPress={handlePhoneNumberKeyPress} 
        errorMessage={errors.phoneNumber}
      />
      <Dropdown
        label="Gender"
        placeholder="Select gender."
        required
        options={genderOption}
        selectedKey={formData.gender}
        onChange={(e: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => handleGenderChange(option)}
        errorMessage={errors.gender}
      />
    </div>
  );
};

export default UserInfo;
