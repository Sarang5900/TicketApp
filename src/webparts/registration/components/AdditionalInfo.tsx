import React from "react";
import { TextField } from "@fluentui/react";
import {IFormData} from "../../Types/formDataTypes";

interface IAdditionalInformationProps {
  formData: IFormData;
  setFormData: React.Dispatch<React.SetStateAction<IFormData>>;
}

const AdditionalInformation: React.FC<IAdditionalInformationProps> = ({formData,setFormData}) => {
  return (
    <div>
      <h3 style={{textDecoration: "underline", textAlign: "center", fontWeight: "bold", textTransform: "uppercase" }}>
        Additional Information
      </h3>
      <TextField
        label="Additional Information"
        placeholder="Enter your query here...(Optional)"
        multiline
        rows={3}
        value={formData.additionalInfo}
        onChange={(e, newValue) =>
          setFormData({ ...formData, additionalInfo: newValue || "" })
        }
      />
    </div>
  );
};

export default AdditionalInformation;
