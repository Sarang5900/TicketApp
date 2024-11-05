import React, { useEffect, useState } from "react";
import { sp } from "@pnp/sp/presets/all";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  Stack,
  TextField,
  Dropdown,
  PrimaryButton,
  DefaultButton,
  IDropdownOption,
  Checkbox,
  Text,
  Label,
  IPersonaProps,
} from "@fluentui/react";
import { IFormData } from "../../Types/formDataTypes"; 
import { IPeoplePickerContext, PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

interface IUserDataPageProps {
  context: WebPartContext;
  userEmailOrPhone: string;
  onDelete: (id: string) => void;
  onUpdate: (data: IFormData) => void;
  userId?: string;
}

const UserDataPage: React.FC<IUserDataPageProps> = ({
  context,
  userEmailOrPhone,
  onDelete,
  onUpdate,
  userId,
}) => {

  const peoplePickerContext: IPeoplePickerContext = {
    absoluteUrl: context.pageContext.web.absoluteUrl,
    msGraphClientFactory: context.msGraphClientFactory,
    spHttpClient: context.spHttpClient,
  };
  
  const [formData, setFormData] = useState<IFormData[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchDataByEmailOrPhone = async (
    emailOrPhone: string
  ): Promise<IFormData[]> => {
    const response = await sp.web.lists
      .getByTitle("BusTicketBooking")
      .items.filter(`Email eq '${emailOrPhone}' or Phone eq '${emailOrPhone}'`)
      .expand("PassengersTravellingWith")
      .select(
        "Id", "Title", "Email", "Password", "Phone", "GenderType", "UserAge", "DepartureCity", "DestinationCity","TravelDate", "ReturnDate", "TravelTime", "NumberOfPassengers", "PassengerAges", "IdentityProof","IdentityProofNumber", "SeatTypes", "WindowPreference", "Food", "Insurance", "CardNumber","ExpiryDate", "Cvv", "AdditionalInfo", "PassengersTravellingWith/Title"
      )();

    console.log(response);   

    return response.map((user) => ({
      id: user.Id,
      fullName: user.Title,
      email: user.Email,
      password: user.Password,
      phoneNumber: user.Phone,
      gender: user.GenderType,
      age: user.UserAge,
      departureCity: user.DepartureCity,
      destinationCity: user.DestinationCity,
      travelDate: new Date(user.TravelDate),
      returnDate: new Date(user.ReturnDate),
      travelTime: user.TravelTime,
      numberOfPassengers: user.NumberOfPassengers,
      passengerNames: user.PassengersTravellingWith.map((p:any) => p.Title),
      passengerAges: user.PassengerAges.split("\n").map(Number),
      identityProof: user.IdentityProof,
      identityProofNumber: user.IdentityProofNumber,
      seatType: user.SeatTypes,
      windowSeatPreference: user.WindowPreference,
      foodPreference: user.Food,
      insuranceOption: user.Insurance,
      cardNumber: user.CardNumber,
      expiryDate: user.ExpiryDate,
      cvv: user.Cvv,
      additionalInfo: user.AdditionalInfo,
    }));
  };

  useEffect(() => {
    fetchDataByEmailOrPhone(userEmailOrPhone)
      .then((data) => {
        console.log("Data fetched for user:", data); 
        setFormData(data); 
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [userEmailOrPhone]);

  const handleInputChange = (
    index: number,
    field: keyof IFormData,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    let value: string | number | boolean = (event.target as HTMLInputElement).value;
    if (field === "age" || field === "numberOfPassengers") {
      value = Number(value);
    }

    const updatedFormData = [...formData];
    updatedFormData[index] = { ...updatedFormData[index], [field]: value };
    setFormData(updatedFormData);
  };

  const handleDropdownChange = (
    index: number,
    field: keyof IFormData,
    option?: IDropdownOption
  ): void => {
    if (!option) {
      return;
    }
  
    const updatedFormData = [...formData];
    updatedFormData[index] = {
      ...updatedFormData[index],
      [field]: String(option.key),
    };
    setFormData(updatedFormData);
  };

  const handleDateChange = (
    index: number,
    field: keyof IFormData,
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value; 

    const [year, month, day] = value.split('-').map(Number);

    const dateValue = new Date(Date.UTC(year, month - 1, day));

    const updatedFormData = [...formData];
    updatedFormData[index] = { ...updatedFormData[index], [field]: dateValue };
    setFormData(updatedFormData);
  };

  // Function to format the Date object for input
  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';

    const year = date.getUTCFullYear(); // Get the UTC year
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Get the UTC month (0-indexed)
    const day = String(date.getUTCDate()).padStart(2, '0'); // Get the UTC day
    return `${year}-${month}-${day}`; 
  };  

  const handlePassengerNameChange = (
    index: number,
    passengerIndex: number,
    selectedPeople: IPersonaProps[]
  ): void => {
    const updatedData = [...formData];
    updatedData[index].passengerNames[passengerIndex] = selectedPeople.length > 0 ? 
    selectedPeople[0].text ?? "": "" ; 
    setFormData(updatedData);
  };

  const handlePassengerAgeChange = (
    index:number, 
    passengerIndex: number, 
    value:number,
  ):void => {
    const updatedData = [...formData];
    updatedData[index].passengerAges[passengerIndex] = value;
    setFormData(updatedData);
  };

  const handleAddPassenger = (index: number):void => {
    const updatedData = [...formData];
    updatedData[index].passengerNames.push('');
    updatedData[index].passengerAges.push(0);
    setFormData(updatedData);
  };

  const handleDeletePassenger = (
    index: number, 
    passengerIndex: number
  ):void => {
    const updatedData = [...formData];
    updatedData[index].passengerNames.splice(passengerIndex, 1);
    updatedData[index].passengerAges.splice(passengerIndex, 1);
    setFormData(updatedData);
  };

  const handleCheckboxChange = (
    index: number,  
    key: keyof IFormData, 
    checked: boolean
  ):void => {
    const updatedFormData = [...formData]; 
    updatedFormData[index] = { 
      ...updatedFormData[index],  
      [key]: checked  
    };
    setFormData(updatedFormData); 
  };

  const handleExpiryDateChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value; // 'YYYY-MM-DD' format
  
    const updatedFormData = [...formData];
    updatedFormData[index] = { ...updatedFormData[index], expiryDate: value };
    setFormData(updatedFormData);
  };

  const handleSave = (): void => {
    formData.forEach((data) => onUpdate(data));
    setIsEditing(false);
  };

  const handleDelete = (index: number): void => {
    onDelete(formData[index].id);
    const updatedFormData = formData.filter((_, i) => i !== index);
    setFormData(updatedFormData);
  };

  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { flexWrap: "wrap", justifyContent: "space-between" } }}>
      {formData.length === 0 ? (
         <Text>No user data found.</Text>
      ) : (
        formData.map((data, index) => (
          <Stack 
            key={index}
            tokens={{ childrenGap: 20 }} 
            styles={{
              root: {
                width: "100%",
                height: "100%",
                padding: 20, 
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                border: "1px solid #eaeaea",
                borderRadius: 8, 
              },
            }}
            >
            <Text
              variant="xLarge"
              styles={{ root: { textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase' } }}
            >
              Login Page
            </Text>
            
            <Stack horizontal tokens={{ childrenGap: 20 }} styles={{ root: { flexWrap: "wrap", justifyContent: "space-between" } }}>
              <Stack.Item styles={{ root: { width: "48%" } }}>
                <TextField
                  label="Full Name"
                  value={data.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(index, "fullName", e)}
                  readOnly={!isEditing}
                />
              </Stack.Item>
              <Stack.Item styles={{ root: { width: "48%" } }}>
                <TextField
                  label="Email"
                  value={data.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(index, "email", e)}
                  readOnly={!isEditing}
                />
              </Stack.Item>
            </Stack>

            {/* Row 2 */}
            <Stack horizontal tokens={{ childrenGap: 20 }} styles={{ root: { flexWrap: "wrap", justifyContent: "space-between" } }}>
              <Stack.Item styles={{ root: { width: "48%" } }}>
                <TextField
                  label="Phone Number"
                  value={data.phoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(index, "phoneNumber", e)}
                  readOnly={!isEditing}
                />
              </Stack.Item>
              <Stack.Item styles={{ root: { width: "48%" } }}>
                {isEditing ? (
                  <Dropdown
                    label="Gender"
                    options={[
                      { key: "Male", text: "Male" },
                      { key: "Female", text: "Female" },
                      { key: "Other", text: "Other" },
                    ]}
                    selectedKey={data.gender}
                    onChange={(e, option) => handleDropdownChange(index, "gender", option)}
                  />
                ) : (
                  <TextField
                    label="Gender"
                    value={data.gender}
                    readOnly 
                  />
                )}
              </Stack.Item>
            </Stack>

            <Stack horizontal tokens={{ childrenGap: 20 }} styles={{ root: { flexWrap: "wrap", justifyContent: "space-between" } }}>
              <Stack.Item styles={{ root: { width: "48%" } }}>
                <TextField
                  label="Age"
                  value={data.age?.toString() || ""} // Convert age to string for TextField
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(index, "age", e)}
                  readOnly={!isEditing}
                />
              </Stack.Item>
            </Stack>
            
            <Stack horizontal tokens={{ childrenGap: 20 }} styles={{ root: { flexWrap: "wrap", justifyContent: "space-between" } }}>
            <Stack.Item styles={{ root: { width: "48%" } }}>
                {isEditing ? (
                  <Dropdown
                    label="Departure City"
                    options={[
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
                    ]}
                    selectedKey={data.departureCity}
                    onChange={(e, option) => handleDropdownChange(index, "departureCity", option)}
                  />
                ) : (
                  <TextField
                    label="Departure City"
                    value={data.departureCity}
                    readOnly 
                  />
                )}
              </Stack.Item>
              <Stack.Item styles={{ root: { width: "48%" } }}>
                {isEditing?(
                  <Dropdown
                  label="Destination City"
                  options={[
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
                  ]}
                  selectedKey={data.destinationCity}
                  onChange={(e, option) => handleDropdownChange(index, "destinationCity", option)}
                />
                ) : (
                  <TextField
                    label="Destination City"
                    value={data.destinationCity}
                    readOnly 
                  />
                )}
              </Stack.Item>
            </Stack>

            <Stack horizontal tokens={{ childrenGap: 20 }} styles={{ root: { flexWrap: "wrap", justifyContent: "space-between" } }}>
              <Stack.Item styles={{ root: { width: "48%" } }}>
                <TextField
                    label="Travel Date"
                    type="date"
                    value={formatDate(data.travelDate)} // Format date for display
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateChange(index, "travelDate", e)}
                    readOnly={!isEditing}
                />
              </Stack.Item>

              <Stack.Item styles={{ root: { width: "48%" } }}>
                <TextField
                    label="Return Date"
                    type="date"
                    value={formatDate(data.returnDate)} // Format date for display
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateChange(index, "returnDate", e)}
                    readOnly={!isEditing}
                />
              </Stack.Item>
            </Stack>

            <Stack horizontal tokens={{ childrenGap: 20 }} styles={{ root: { flexWrap: "wrap", justifyContent: "space-between" } }}>
              <Stack.Item styles={{ root: { width: "48%" } }}>
                {isEditing? (
                  <Dropdown
                    label="Travel Time"
                    options={[
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
                    ]}
                    selectedKey={data.travelTime}
                    onChange={(e, option) => handleDropdownChange(index, "travelTime", option)}
                  />
                ): (
                  <TextField
                    label="Travel Time"
                    value={data.travelTime}
                    readOnly 
                  />
                )}
              </Stack.Item>
            </Stack>

            <Stack tokens={{ childrenGap: 20 }}>
              <TextField
                label="Number of Passengers"
                type="number"
                value={data.passengerNames.length.toString()} // Convert number to string
                readOnly={!isEditing} 
              />
              {data.passengerNames.map((name, passengerIndex) => (
                <Stack key={passengerIndex} horizontal tokens={{ childrenGap: 20 }} styles={{ root: { flexWrap: "wrap", justifyContent: "space-between" } }}>
                  <Stack.Item styles={{ root: { width: "48%" } }}>
                  <PeoplePicker
                    context={peoplePickerContext}
                    titleText="Select a Passenger"
                    personSelectionLimit={1}
                    groupName={""}
                    principalTypes={[PrincipalType.User]}
                    showtooltip={true}
                    disabled={!isEditing}
                    onChange={(items: IPersonaProps[]) => handlePassengerNameChange(index, passengerIndex, items)}
                    placeholder="Select a passenger"
                    defaultSelectedUsers={name ? [name] : []}
                  />
                  </Stack.Item>
                  <Stack.Item styles={{ root: { width: "48%" } }}>
                    <TextField
                      label={`Passenger ${passengerIndex + 1} Age`}
                      type="number"
                      value={data.passengerAges[passengerIndex]?.toString() || ""}
                      onChange={(e) => handlePassengerAgeChange(index, passengerIndex, parseInt((e.target as HTMLInputElement).value) || 0)}
                      readOnly={!isEditing}
                    />
                  </Stack.Item>
                  {isEditing && (
                    <Stack.Item>
                      <DefaultButton style={{marginTop:'10px'}} text="Remove" onClick={() => handleDeletePassenger(index, passengerIndex)} />
                    </Stack.Item>
                  )}
                </Stack>
              ))}
              {isEditing && data.passengerNames.length < 3 &&(
                <PrimaryButton text="Add Passenger" onClick={() => handleAddPassenger(index)} />
              )}
            </Stack>

            <Stack horizontal tokens={{ childrenGap: 20 }} styles={{ root: { flexWrap: "wrap", justifyContent: "space-between" } }}>
              <Stack.Item styles={{ root: { width: "48%" } }}>
                {isEditing? (
                  <Dropdown
                  label="Identity Proof Type"
                  options={[
                    { key: "Aadhar", text: "Aadhar" },
                    { key: "Passport", text: "Passport" },
                    { key: "Voter ID", text: "Voter ID" },
                  ]}
                  selectedKey={data.identityProof}
                  onChange={(e, option) => handleDropdownChange(index, "identityProof", option)}
                />
                ) : (
                  <TextField
                    label="Identity Proof Type"
                    value={data.identityProof}
                    readOnly 
                  />
                )}
              </Stack.Item>

              <Stack.Item styles={{ root: { width: "48%" } }}>
                <TextField
                  label="Identity Proof Number"
                  value={data.identityProofNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(index, "identityProofNumber", e)}
                  readOnly={!isEditing}
                />
              </Stack.Item>
            </Stack>

            <Stack horizontal tokens={{ childrenGap: 20 }} styles={{ root: { flexWrap: "wrap", justifyContent: "space-between" } }}>
              <Stack.Item styles={{ root: { width: "48%" } }}>
                {isEditing ? (
                  <Dropdown
                    label="Seat Type"
                    options={[
                      { key: "Sleeper", text: "Sleeper" },
                      { key: "Seater", text: "Seater" },
                      { key: "AC", text: "AC" },
                      { key: "Non-AC", text: "Non-AC" },
                    ]}
                    selectedKey={data.seatType}
                    onChange={(e, option) => handleDropdownChange(index, "seatType", option)}
                  />
                ) : (
                  <TextField
                    label="Seat Type"
                    value={data.seatType}
                    readOnly 
                  />
                )}
              </Stack.Item>

              <Stack.Item styles={{ root: { width: "48%" } }}>
                {isEditing? (
                  <Dropdown
                    label="Food Preferences"
                    options={[
                      { key: "Veg", text: "Vegetarian" },
                      { key: "NonVeg", text: "Non-Vegetarian" },
                    ]}
                    selectedKey={data.foodPreference}
                    onChange={(e, option) => handleDropdownChange(index, "foodPreference", option)}
                  />
                ):(
                  <TextField
                    label="Food Preferences"
                    value={data.foodPreference}
                    readOnly 
                  />
                )}
              
              </Stack.Item>
            </Stack>

            <Stack horizontal tokens={{ childrenGap: 20 }} styles={{ root: { flexWrap: "wrap", justifyContent: "space-between" } }}>
              <Stack.Item styles={{ root: { width: "48%" } }}>
                {isEditing ? (
                  <Checkbox
                    label="Window Preference"
                    checked={data.windowSeatPreference}
                    onChange={(_, checked) => handleCheckboxChange(index, 'windowSeatPreference', !!checked)}
                  />
                ) : (
                  <>
                    <Label>Window Prefeence:</Label>
                    <Text variant="medium">{data.windowSeatPreference ? "Yes" : "No"}</Text> {/* Display checked state */}
                  </>
                )}
              </Stack.Item>

              <Stack.Item styles={{ root: { width: "48%" } }}>
                {isEditing? (
                  <Checkbox
                  label="Insurance Option"
                  checked={data.insuranceOption}
                  onChange={(_, checked) => handleCheckboxChange(index, 'insuranceOption', !!checked)} 
                />
                ) : (
                  <>
                    <Label>Insurance Option:</Label>
                    <Text variant="medium">{data.insuranceOption ? "Yes" : "No"}</Text> {/* Display checked state */}
                  </>
                )}
              </Stack.Item>
            </Stack>

            <Stack horizontal tokens={{ childrenGap: 20 }} styles={{ root: { flexWrap: "wrap", justifyContent: "space-between" } }}>
              <Stack.Item styles={{ root: { width: "48%" } }}>
                <TextField
                  label="Card Number"
                  value={data.cardNumber?.toString() || ""} // Convert age to string for TextField
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(index, "cardNumber", e)}
                  readOnly={!isEditing}
                />
              </Stack.Item>

              <Stack.Item styles={{ root: { width: "48%" } }}>
                <TextField
                  label="Expiry Date"
                  type="date"
                  value={data.expiryDate || ''} // Use expiryDate string directly
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleExpiryDateChange(index, e)}
                  readOnly={!isEditing}
                />
              </Stack.Item>
            </Stack>

            <Stack horizontal tokens={{ childrenGap: 20 }} styles={{ root: { flexWrap: "wrap", justifyContent: "space-between" } }}>
              <Stack.Item styles={{ root: { width: "48%" } }}>
                <TextField
                  label="CVV"
                  value={data.cvv?.toString() || ""} // Convert age to string for TextField
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(index, "cvv", e)}
                  readOnly={!isEditing}
                />
              </Stack.Item>
            </Stack>

            <Stack tokens={{ childrenGap: 20 }}>
              <TextField
                label="Additional information"
                multiline
                value={data.additionalInfo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(index, "additionalInfo", e)}
                readOnly= {!isEditing}
              />
            </Stack>

            {/* Save/Cancel/Delete buttons */}
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              {isEditing ? (
                <>
                  <PrimaryButton text="Save" onClick={handleSave} />
                  <DefaultButton text="Cancel" onClick={() => setIsEditing(false)} />
                </>
              ) : (
                <PrimaryButton text="Edit" onClick={() => setIsEditing(true)} />
              )}
              <DefaultButton text="Delete" onClick={() => handleDelete(index)} />
            </Stack>
          </Stack>
        ))
      )}
    </Stack>
  );
};

export default UserDataPage;
