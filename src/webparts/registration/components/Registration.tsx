import React, { useEffect, useState } from "react";
import { PrimaryButton, Stack, ProgressIndicator,Dialog, DialogFooter, DialogType, DefaultButton } from "@fluentui/react";
import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists"; 
import "@pnp/sp/items";
import UserInfo from "./UserInfo";
import TravelDetails from "./TravelDetails";
import PassengerInfo from "./PassengerInfo";
import TicketPreferences from "./TicketReferences";
import PaymentDetails from "./PaymentDetails";
import AdditionalInfo from "./AdditionalInfo";
import { IBusTicketBookingProps } from "./IRegistrationProps";
import { IFormData } from "../../Types/formDataTypes";

const BookingForm: React.FC<IBusTicketBookingProps> = ({ context, description }) => {

  useEffect(() => {
    sp.setup({
      spfxContext: context as any,
    });
  }, [context]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<IFormData>({
    id: "",
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
    age: undefined,
    departureCity: "",
    destinationCity: "",
    travelDate: undefined,
    returnDate: undefined,
    travelTime: "",
    numberOfPassengers: 1,
    passengerNames: [""],
    passengerAges: [undefined],
    identityProof: "",
    identityProofNumber: "",
    seatType: "",
    windowSeatPreference: false,
    foodPreference: "",
    insuranceOption: false,
    cardNumber: 0,
    expiryDate: "",
    cvv: 0,
    additionalInfo: "",
    uploadedFile: undefined,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState<"success" | "error">("success");
  const [isSubmitConfirmVisible, setIsSubmitConfirmVisible] = useState(false);

  const steps = [
    "User Information",
    "Travel Details",
    "Passenger Information",
    "Ticket Preferences",
    "Payment Details",
    "Additional Information",
  ];

  const stepComponents = [
    <UserInfo key={0} formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />,
    <TravelDetails key={1} formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />,
    <PassengerInfo key={2} formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} context={context} />,
    <TicketPreferences key={3} formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />,
    <PaymentDetails key={4} formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />,
    <AdditionalInfo key={5} formData={formData} setFormData={setFormData}/>,
   ];

   const validateCurrentStep = (): boolean => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};
  
    switch (currentStep) {
      case 0:
        // User Information validation
        if (!formData.fullName) {
          newErrors.fullName = "Full name is required.";
          valid = false;
        }
        if (!formData.email) {
          newErrors.email = "Email is required.";
          valid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          newErrors.email = "Email format is invalid.";
          valid = false;
        }
        if (!formData.password) {
          newErrors.password = "Password is required.";
          valid = false;
        } else if (formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters long.";
          valid = false;
        }
        if (!formData.phoneNumber) {
          newErrors.phoneNumber = "Phone number is required.";
          valid = false;
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
          newErrors.phoneNumber = "Phone number must be a valid 10-digit number.";
          valid = false;
        }
        if (!formData.age) {
          newErrors.age = "Age is required.";
          valid = false;
        } else if (formData.age <= 0 || formData.age >= 100) {
          newErrors.age = "Age must be a valid number between 1 and 99.";
          valid = false;
        }
        if (!formData.gender) {
          newErrors.gender = "Gender is required.";
          valid = false;
        }
        break;
      case 1:
        // Travel Details validation
        if (!formData.departureCity) {
          newErrors.departureCity = "Departure city is required.";
          valid = false;
        }
        if (!formData.destinationCity) {
          newErrors.destinationCity = "Destination city is required.";
          valid = false;
        }
        if (!formData.travelDate) {
          newErrors.travelDate = "Travel date is required.";
          valid = false;
        } else if (new Date(formData.travelDate) < new Date()) {
          newErrors.travelDate = "Travel date cannot be in the past.";
          valid = false;
        }
        if (!formData.travelTime) {
          newErrors.travelTime = "Travel time is required.";
          valid = false;
        }
        break;
      case 2:
        // Passenger Information validation
        formData.passengerNames.forEach((name, index) => {
          if (!name.trim()) {
            newErrors[`passengerName${index}`] = `Passenger ${index + 1} name is required.`;
            valid = false;
          } else if (!/^[A-Za-z\s]+$/.test(name)) {
            newErrors[`passengerName${index}`] = `Passenger ${index + 1} name should contain only alphabets.`;
            valid = false;
          } else if (name.trim().length < 3) {
            newErrors[`passengerName${index}`] = `Passenger ${index + 1} name must be at least 3 characters long.`;
            valid = false;
          }
        });
  
        formData.passengerAges.forEach((age, index) => {

          if(!age){
            newErrors[`passengerAge${index}`] = `Passenger ${index + 1} age required.`
            valid = false;
          }

          if (!age || age <= 0 || age >= 100) {
            newErrors[`passengerAge${index}`] = `Passenger ${index + 1} age must be a valid number between 1 and 99.`;
            valid = false;
          }
        });
  
        if (formData.passengerNames.length === 0) {
          newErrors.passengerNames = "At least one passenger name is required.";
          valid = false;
        }
  
        if (formData.passengerAges.length === 0) {
          newErrors.passengerAges = "At least one passenger age is required.";
          valid = false;
        }
  
        // Identity Proof Validation
        if (!formData.identityProof) {
          newErrors.identityProof = "Identity proof is required.";
          valid = false;
        }
  
        // Identity Proof Number Validation
        if (!formData.identityProofNumber) {
          newErrors.identityProofNumber = "Identity proof number is required.";
          valid = false;
        } else if (formData.identityProof === "Aadhar" && !/^\d{12}$/.test(formData.identityProofNumber)) {
          newErrors.identityProofNumber = "Aadhar number must be a 12-digit number.";
          valid = false;
        } else if (formData.identityProof === "Passport" && !/^[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]$/.test(formData.identityProofNumber)) {
          newErrors.identityProofNumber = "Invalid passport number format.";
          valid = false;
        } else if (formData.identityProof === "Voter ID" && !/^[A-Z]{3}[0-9]{7}$/.test(formData.identityProofNumber)) {
          newErrors.identityProofNumber = "Invalid Voter ID format.";
          valid = false;
        }
  
        // File Upload Validation
        if (!formData.uploadedFile) {
          newErrors.file = "File is required.";
          valid = false;
        } else if (!["image/png", "image/jpg", "image/jpeg", "application/pdf"].includes(formData.uploadedFile.type)) {
          newErrors.file = "Only image files (.png, .jpg, .jpeg) or PDFs are allowed.";
          valid = false;
        }
        break;
      case 3:
        // Ticket Preferences validation
        if (!formData.seatType) {
          newErrors.seatType = "Seat type is required.";
          valid = false;
        }
        break;
      case 4:
        // Payment Details Validation
        if (!formData.cardNumber) {
          newErrors.cardNumber = "Card number is required.";
          valid = false;
        } else if (!/^\d{16}$/.test(String(formData.cardNumber))) {
          newErrors.cardNumber = "Card number must be a 16-digit number.";
          valid = false;
        }
        if (!formData.expiryDate) {
          newErrors.expiryDate = "Expiry date is required.";
          valid = false;
        } else if (new Date(formData.expiryDate) < new Date()) {
          newErrors.expiryDate = "Expiry date must be in the future.";
          valid = false;
        }
        if (!formData.cvv) {
          newErrors.cvv = "CVV is required.";
          valid = false;
        } else if (!/^\d{3}$/.test(String(formData.cvv))) {
          newErrors.cvv = "CVV must be a 3-digit number.";
          valid = false;
        }
        break;
      default:
        break;
    }
  
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return valid;
  };
  

  const nextStep = (): void => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = (): void => {
    setCurrentStep(currentStep - 1);
  };

  const handleStepClick = (stepIndex: number): void => {

    if (stepIndex >= 0 && stepIndex < steps.length) {
      if (stepIndex > currentStep && !validateCurrentStep()) {
        return;
      }
      setCurrentStep(stepIndex);
    } else {
      setDialogMessage("Please fill in all required fields before proceeding.");
      setDialogType("error");
      setIsDialogVisible(true);
    }
  };

  //const showConfirmDialog = () => setIsDialogVisible(true);
  const closeConfirmDialog = (): void => setIsDialogVisible(false);
  

  console.log(description);
  

  const uploadFileToDocumentLibrary = async (file: File): Promise<string> => {
    if (!file) {
        throw new Error("No file provided for upload.");
    }

    const libraryName = "Shared Documents"; 
    const folderPath = `/sites/TenantPracticeSite/${libraryName}`; 

    try {
       
        const response = await sp.web.getFolderByServerRelativeUrl(folderPath).files.add(file.name, file, true);
        
        console.log("File uploaded successfully:", response.data.ServerRelativeUrl);
        return response.data.ServerRelativeUrl; 
    } catch (error) {
        console.error("File upload failed:", error);
        setDialogMessage("File upload failed. Please try again.");
        setDialogType("error");
        setIsDialogVisible(true);
        return "File upload faild";
    }
  };

  const getUserIds = async (names: string[]): Promise<number[]> => {
    const userIds: number[] = [];
    
    for (const name of names) {
      if (name) { 
        try {
          const user = await sp.web.ensureUser(name);
          if (user && user.data && user.data.Id) {
            userIds.push(user.data.Id);
          }
        } catch (error) {
          console.error(`Error retrieving ID for user ${name}:`, error);
        }
      }
    }
   
    return userIds;
  };

  const confirmSubmit = (): void => {
    closeConfirmDialog();
    setDialogMessage("Form Submitted Successfully!");
    setDialogType("success");
    setIsDialogVisible(true);
  };

  const handleSubmit = async (): Promise<void> => {
    let fileUrl = '';

    if (formData.uploadedFile) {
      try {
          fileUrl = await uploadFileToDocumentLibrary(formData.uploadedFile);
      } catch (error) {
        console.error("File upload failed:", error);
        setDialogMessage("File upload failed. Please try again.");
        setDialogType("error");
        setIsDialogVisible(true);
        return;
      }
    }

    try {

      const passengerIds = await getUserIds(formData.passengerNames);

      await sp.web.lists.getByTitle("BusTicketBooking").items.add({
        
        Title: formData.fullName,
        Email: formData.email,
        Phone: formData.phoneNumber,
        Password: formData.password,
        GenderType: formData.gender,
        UserAge: formData.age,
        DepartureCity: formData.departureCity,
        DestinationCity: formData.destinationCity,
        TravelDate: formData.travelDate?.toISOString(),
        ReturnDate: formData.returnDate?.toISOString(),
        TravelTime: formData.travelTime,
        NumberOfPassengers: formData.numberOfPassengers,
        PassengersTravellingWithId: { results: passengerIds },
        PassengerAges: formData.passengerAges.join("\n"),
        IdentityProof: formData.identityProof,
        IdentityProofNumber: formData.identityProofNumber,
        SeatTypes: formData.seatType,
        WindowPreference: !!formData.windowSeatPreference,
        Food: formData.foodPreference,
        Insurance: !!formData.insuranceOption,
        CardNumber: formData.cardNumber.toString(),
        ExpiryDate: formData.expiryDate,
        Cvv: formData.cvv.toString(),
        AdditionalInfo: formData.additionalInfo,
        DocumentFile: fileUrl ? { Url: fileUrl, Description: "Uploaded File" } : undefined,
      });
      setDialogMessage("Booking successful!");
      setDialogType("success");
      setIsDialogVisible(true);
      
      setFormData({
        id:"",
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        gender: "",
        age: undefined,
        departureCity: "",
        destinationCity: "",
        travelDate: undefined,
        returnDate: undefined,
        travelTime: "",
        numberOfPassengers: 1,
        passengerNames: [""],
        passengerAges: [undefined],
        identityProof: "",
        identityProofNumber: "",
        seatType: "",
        windowSeatPreference: false,
        foodPreference: "",
        insuranceOption: false,
        cardNumber: 0,
        expiryDate: "",
        cvv: 0,
        additionalInfo: "",
        uploadedFile: undefined,
      });
      setCurrentStep(0); 
    } catch (error) {
      console.error("Error saving data:", error);
      setDialogMessage("An error occurred while saving data.");
      setDialogType("error");
      setIsDialogVisible(true);
    }
    confirmSubmit();
  };

  const handleFinalSubmit = async (): Promise<void> => {
    setIsSubmitConfirmVisible(false);
     await handleSubmit();
  };

  return (
    <Stack
      tokens={{ childrenGap: 20 }}
      styles={{ root: { width: "100%", margin: "auto", padding: 20, background: "#f4f4f4", borderRadius: 10, boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" } }}
    >
      <h1 style={{ textAlign: "center", fontWeight: "bold", textTransform: "uppercase", textDecoration: "underline", }}>
        Ticket Booking
      </h1>

      {/* Customized ProgressIndicator */}
      <ProgressIndicator
        label={`Step ${currentStep + 1} of ${steps.length}`}
        percentComplete={(currentStep + 1) / steps.length}
        styles={{
          itemProgress: { backgroundColor: "", height: 8 },
          progressBar: { backgroundColor: "#121214", height: 8, borderRadius: 4 },
          itemDescription: { color: "#333", fontWeight: "bold" }
        }}
      />

      <hr style={{ borderTop: "1px dotted black" , width: "100%"}}/>
      <Stack horizontal tokens={{ childrenGap: 10 }} styles={{ root: { marginTop: 10 } }}>
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', width: '100%' }}>
          <div style={{ display: 'inline-flex' }}>  
            {steps.map((step, index) => (
              <div
                key={index}
                style={{
                  flex: '0 0 auto',
                  textAlign: "center",
                  fontWeight: currentStep === index ? "bold" : "normal",
                  color: currentStep === index ? "#0078d4" : "#666",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  minWidth: '120px', 
                  marginRight: '10px', 
                  backgroundColor: currentStep === index ? "#e8f4ff" : "transparent",
                  border: currentStep === index ? '2px solid #0078d4' : '2px solid transparent',
                }}
                onClick={() => handleStepClick(index)}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </Stack>

      <hr style={{ borderTop: "1px dotted black" , width: "100%"}}/>

      <div style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10, boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", marginTop: 20 }}>
        {stepComponents[currentStep]}
      </div>

      <Stack horizontal tokens={{ childrenGap: 10 }} horizontalAlign="start" styles={{ root: { marginTop: 20 } }}>
        {currentStep > 0 && (
          <PrimaryButton
            text="Back"
            onClick={previousStep}
            styles={{
              root: { backgroundColor: "#f3f2f1", color: "#0078d4", border: "1px solid #0078d4", fontWeight: "bold" },
              rootHovered: { backgroundColor: "#e1e1e1" },
            }}
          />
        )}
        {currentStep < stepComponents.length - 1 ? (
          <PrimaryButton
            text="Next"
            onClick={nextStep}
            styles={{
              root: { backgroundColor: "#0078d4", color: "#fff", fontWeight: "bold" },
              rootHovered: { backgroundColor: "#005a9e" },
            }}
          />
        ) : (
          <PrimaryButton
            text="Submit"
            onClick={() => setIsSubmitConfirmVisible(true)}
            styles={{
              root: { backgroundColor: "#28a745", color: "#fff", fontWeight: "bold" },
              rootHovered: { backgroundColor: "#218838" },
            }}
          />
        )}
      </Stack>

      <Dialog
        hidden={!isSubmitConfirmVisible}
        onDismiss={() => setIsSubmitConfirmVisible(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Confirm Submission",
          subText: "Are you sure you want to submit the form?"
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={handleFinalSubmit} text="Yes" />
          <DefaultButton onClick={() => setIsSubmitConfirmVisible(false)}  text="No" />
        </DialogFooter>
      </Dialog>

      <Dialog
        hidden={!isDialogVisible}
        onDismiss={closeConfirmDialog}
        dialogContentProps={{
          type: dialogType === "success" ? DialogType.normal : DialogType.largeHeader,
          title: dialogType === "success" ? "Success" : "Error",
          subText: dialogMessage,
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={closeConfirmDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default BookingForm;