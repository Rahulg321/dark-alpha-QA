import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
  resetPasswordLink: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""; // Or your specific base URL

export const ResetPasswordEmail: React.FC<
  Readonly<ResetPasswordEmailProps>
> = ({ resetPasswordLink }) => (
  <Html>
    <Head />
    <Preview>Reset your Hydranode password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          {/* Optional: Add Logo */}
          {/* <Img src={`${baseUrl}/static/logo.png`} width="49" height="21" alt="Logo" /> */}
          <Heading style={heading}>Reset Your Password</Heading>
          <Text style={paragraph}>
            You&apos;ve requested to reset your password for your Dark Alpha
            Capital account. Click the button below to set a new password:
          </Text>

          <Button style={button} href={resetPasswordLink}>
            Reset Password
          </Button>

          <Text style={paragraph}>
            If you didn&apos;t request a password reset, please ignore this
            email or contact support if you have concerns.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
  borderRadius: "5px",
  border: "1px solid #eaeaea",
};

const box = {
  padding: "0 48px",
};

const heading = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  marginBottom: "20px",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "1.5",
  textAlign: "left" as const,
  marginBottom: "20px",
};

const button = {
  backgroundColor: "#007bff", // Blue color
  borderRadius: "5px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "200px", // Adjust width as needed
  padding: "12px 20px",
  margin: "20px auto", // Center the button
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  marginTop: "16px",
};
