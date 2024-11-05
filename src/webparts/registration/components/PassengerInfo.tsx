import * as React from "react";
import {
  TextField,
  Dropdown,
  Stack,
  Label,
  DefaultButton,
  MessageBar,
  MessageBarType,
  IPersonaProps,
} from "@fluentui/react";
import { IFormData } from "../../Types/formDataTypes";
import { IPeoplePickerContext, PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface IPassengerInformationProps {
  formData: IFormData;
  setFormData: React.Dispatch<React.SetStateAction<IFormData>>;
  errors: { [key: string]: string };
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  context: WebPartContext;
}

const PassengerInformation: React.FC<IPassengerInformationProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  context,
}) => {

  const peoplePickerContext: IPeoplePickerContext = {
    absoluteUrl: context.pageContext.web.absoluteUrl,
    msGraphClientFactory: context.msGraphClientFactory,
    spHttpClient: context.spHttpClient,
  };

  const handlePeoplePickerChange = (items: IPersonaProps[], index: number):void => {
    const selectedName = items.length > 0 ? items[0]?.text ?? "" : "";
    const updatedPassengerNames = [...formData.passengerNames];
    updatedPassengerNames[index] = selectedName;

    setFormData((prevData) => ({
      ...prevData,
      passengerNames: updatedPassengerNames,
    }));
  };

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
        Passengers Information
      </h3>

      <Dropdown
        label="Number of Passengers"
        options={[
          { key: 1, text: "1" },
          { key: 2, text: "2" },
          { key: 3, text: "3" },
        ]}
        selectedKey={formData.numberOfPassengers}
        onChange={(e, option) => {
          const numberOfPassengers = option?.key as number;
          setFormData({
            ...formData,
            numberOfPassengers,
            passengerNames: Array(numberOfPassengers).fill(""),
            passengerAges: Array(numberOfPassengers).fill(undefined),
          });
          setErrors({});
        }}
      />

      {Array.from({ length: formData.numberOfPassengers }).map((_, index) => (
        <div key={index}>
          <PeoplePicker
            placeholder={`Enter Passenger ${index + 1} Name.`}
            context={peoplePickerContext}
            titleText={`Passenger ${index + 1} Name`}
            personSelectionLimit={1}
            groupName={""}
            showtooltip={true}
            required={true}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000}
            ensureUser={true}
            onChange={(items) => {
              handlePeoplePickerChange(items, index);
      
              setErrors((prev) => {
                const updatedErrors = { ...prev };
                if (items.length === 0) {
                  updatedErrors[`passengerName${index}`] = `Passenger ${index + 1} name is required.`;
                } else {
                  delete updatedErrors[`passengerName${index}`];
                }
                return updatedErrors;
              });
            }}
          />

          <TextField
            label={`Passenger ${index + 1} Age`}
            placeholder={`Enter Passenger ${index + 1} age.`}
            required
            type="number"
            value={formData.passengerAges[index]?.toString() || ""}
            onChange={(e, newValue) => {
              const ageValue = newValue ? Number(newValue) : undefined;
              const updatedAges = [...formData.passengerAges];
              updatedAges[index] = ageValue;

              setFormData((prevData) => ({
                ...prevData,
                passengerAges: updatedAges,
              }));

              setErrors((prev) => {
                const updatedErrors = { ...prev };
                if (ageValue !== undefined && (ageValue <= 0 || ageValue >= 100)) {
                  updatedErrors[`passengerAge${index}`] = `Passenger ${index + 1} age must be between 1 and 99.`;
                } else {
                  delete updatedErrors[`passengerAge${index}`];
                }
                return updatedErrors;
              });
            }}
            errorMessage={errors[`passengerAge${index}`]}
          />
        </div>
      ))}

      <Dropdown
        label="Identity Proof"
        placeholder="Select an identity proof."
        required
        options={[
          { key: "Aadhar", text: "Aadhar" },
          { key: "Passport", text: "Passport" },
          { key: "Voter ID", text: "Voter ID" },
        ]}
        selectedKey={formData.identityProof}
        onChange={(e, option) => {
          const selectedProof = option?.key as string;
          setFormData({ ...formData, identityProof: selectedProof });
          setErrors((prev) => ({
            ...prev,
            identityProof: selectedProof ? "" : "Identity proof is required.",
          }));
        }}
        errorMessage={errors.identityProof}
      />

      <TextField
        label="Identity Proof Number"
        placeholder="Enter your proof number."
        required
        value={formData.identityProofNumber}
        onChange={(e, newValue) => {
          const proofNumber = newValue || "";
          setFormData({ ...formData, identityProofNumber: proofNumber });
          setErrors((prev) => ({
            ...prev,
            identityProofNumber: proofNumber ? "" : "Identity proof number is required.",
          }));
        }}
        errorMessage={errors.identityProofNumber}
      />

      <Stack tokens={{ childrenGap: 10 }}>
        <Label style={{ fontWeight: "bold" }}>Upload File (Image/PDF):</Label>
        <input
          type="file"
          accept=".png, .jpg, .jpeg, .pdf"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setFormData({ ...formData, uploadedFile: file });
            setErrors((prev) => ({
              ...prev,
              file: file ? "" : "File is required.",
            }));
          }}
          style={{ display: "none" }}
          id="fileUpload"
        />
        <DefaultButton
          text="Choose File"
          onClick={() => document.getElementById("fileUpload")?.click()}
        />
        <span>{formData.uploadedFile ? formData.uploadedFile.name : 'No file chosen'}</span>
        {errors.file && (
          <MessageBar messageBarType={MessageBarType.error}>{errors.file}</MessageBar>
        )}
      </Stack>
    </div>
  );
};

export default PassengerInformation;
