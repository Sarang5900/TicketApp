import React, { useState } from "react";
import { IUserLoginProps } from "./IUserLoginProps";
import Login from "./LoginPage";
import UserDataPage from "./UserDataPage";
import { Stack, Spinner, MessageBar, MessageBarType } from "@fluentui/react";
import { sp } from "@pnp/sp/presets/all";
import { IFormData } from "../../Types/formDataTypes";

const UserLogin: React.FC<IUserLoginProps & { onLoginFail: () => void }> = ({
  context,
  onLoginFail,
}) => {
  const [userEmailOrPhone, setUserEmailOrPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [popupType, setPopupType] = useState<MessageBarType | undefined>(undefined);

  const fetchUserData = async (
    emailOrPhone: string
  ): Promise<{ id: string }> => {
    const response = await sp.web.lists
      .getByTitle("BusTicketBooking")
      .items.filter(
        `Email eq '${emailOrPhone}' or Phone eq '${emailOrPhone}'`
      )();

    if (response.length > 0) {
      return { id: response[0].Id };
    }
    throw new Error("User not found");
  };

  const handleLoginSuccess = async (emailOrPhone: string): Promise<void> => {
    setLoading(true);
    setUserEmailOrPhone(emailOrPhone);

    try {
      const userData = await fetchUserData(emailOrPhone);
      setUserId(userData.id);
    } catch (error) {
      console.error("Error fetching user data:", error);
      onLoginFail();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!userId) return;

    try {
      await sp.web.lists
        .getByTitle("BusTicketBooking")
        .items.getById(parseInt(userId))
        .delete();
      setPopupMessage(`User with ID: ${userId} deleted successfully.`);
      setPopupType(MessageBarType.success);
      console.log(`User with ID: ${userId} deleted`);
    } catch (error) {
      setPopupMessage("Error deleting user.");
      setPopupType(MessageBarType.error);
      console.error("Error deleting user:", error);
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

  const handleUpdate = async (updatedData: IFormData): Promise<void> => {
    if (!userId) return;

    try {
      const passengerIds = await getUserIds(updatedData.passengerNames);

      await sp.web.lists
        .getByTitle("BusTicketBooking")
        .items.getById(parseInt(userId))
        .update({
          Title: updatedData.fullName,
          Email: updatedData.email,
          Phone: updatedData.phoneNumber,
          Password: updatedData.password,
          GenderType: updatedData.gender,
          UserAge: updatedData.age,
          DepartureCity: updatedData.departureCity,
          DestinationCity: updatedData.destinationCity,
          TravelDate: updatedData.travelDate?.toISOString(),
          ReturnDate: updatedData.returnDate?.toISOString(),
          TravelTime: updatedData.travelTime,
          NumberOfPassengers: updatedData.numberOfPassengers,
          PassengersTravellingWithId: { results: passengerIds },
          PassengerAges: updatedData.passengerAges.join("\n"),
          IdentityProof: updatedData.identityProof,
          IdentityProofNumber: updatedData.identityProofNumber,
          SeatTypes: updatedData.seatType,
          WindowPreference: !!updatedData.windowSeatPreference,
          Food: updatedData.foodPreference,
          Insurance: !!updatedData.insuranceOption,
          CardNumber: updatedData.cardNumber.toString(),
          ExpiryDate: updatedData.expiryDate,
          Cvv: updatedData.cvv.toString(),
          AdditionalInfo: updatedData.additionalInfo,
        });

      setPopupMessage(`Data updated successfully.`);
      setPopupType(MessageBarType.success);
      console.log(`User with ID: ${userId} updated successfully`);
    } catch (error) {
      setPopupMessage("Error updating data.");
      setPopupType(MessageBarType.error);
      console.error("Error updating data:", error);
    }
  };

  if(loading){
    return <Spinner label="loading..." />
  }

  return (
    <Stack
      tokens={{ childrenGap: 20 }}
      styles={{ root: { maxWidth: 600, margin: "auto", padding: 20 } }}
    >
      {userId && userEmailOrPhone ? (
        <UserDataPage
          context={context}
          userEmailOrPhone={userEmailOrPhone}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          userId={userId}
        />
      ) : (
        <Login context={context} onLoginSuccess={handleLoginSuccess} />
      )}

      {popupMessage && (
        <MessageBar
          messageBarType={popupType}
          isMultiline={false}
          onDismiss={() => setPopupMessage(null)}
          dismissButtonAriaLabel="Close"
        >
          {popupMessage}
        </MessageBar>
      )}
    </Stack>
  );
};

export default UserLogin;
