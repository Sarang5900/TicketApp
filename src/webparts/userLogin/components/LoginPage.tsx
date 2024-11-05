import React, { useEffect, useState } from "react";
import {TextField, Stack, Text } from "@fluentui/react";
import * as strings from 'AuthContainerWebPartStrings'
import { sp } from "@pnp/sp/presets/all";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import styles from "./UserLogin.module.scss";

interface ILoginProps {
  context: WebPartContext;
  onLoginSuccess: (email: string) => void;
}

const Login: React.FC<ILoginProps> = ({ context, onLoginSuccess }) => {

  useEffect(() => {
    sp.setup({
      spfxContext: context as any,
    });
  }, [context]);

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (): Promise<void> => {
    try {
      const users = await sp.web.lists
        .getByTitle("BusTicketBooking")
        .items.filter(
          `(Email eq '${emailOrPhone}' or Phone eq '${emailOrPhone}') and Password eq '${password}'`
        )();

      if (users.length > 0) {
        onLoginSuccess(emailOrPhone);
      } else {
        setError("Invalid email/phone number or password.");
      }
    } catch (error) {
      setError("Error during login.");
      console.error(error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Text
        variant="xLarge"
        styles={{
          root: {
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
            textTransform: "uppercase",
          },
        }}
      >
        {strings.LoginTitle}
      </Text>
      <p>{strings.LoginDescription}</p>
      <Stack className={styles.loginCard} tokens={{ childrenGap: 10 }}>
        <TextField
          label="Email or Phone Number"
          value={emailOrPhone}
          onChange={(e, val) => setEmailOrPhone(val || "")}
          required
        />
        <TextField
          label="Password"
          type="password"
          canRevealPassword
          value={password}
          onChange={(e, val) => setPassword(val || "")}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button onClick={handleLogin}>
          {strings.LoginButtonText}
        </button>
      </Stack>
    </div>
  );
};

export default Login;
