import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface TwoFactorEmailProps {
  token: string;
}

export const TwoFactorEmail: React.FC<Readonly<TwoFactorEmailProps>> = ({
  token,
}) => (
  <Html>
    <Head />
    <Preview>Your Two-Factor Authentication Code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Two-Factor Authentication</Heading>
        <Text style={text}>
          Here is your two-factor authentication code for your Diligence Dark
          Alpha account:
        </Text>
        <Section style={codeBox}>
          <Text style={codeText}>{token}</Text>
        </Section>
        <Text style={text}>
          If you didn&apos;t request this code, please ignore this email or
          contact support if you have concerns.
        </Text>
        <Text style={footer}>
          ©2024 Diligence Dark Alpha. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default TwoFactorEmail;

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  padding: "20px",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
};

const h1 = {
  color: "#18181b",
  fontSize: "28px",
  fontWeight: "600",
  margin: "0 0 20px",
};

const text = {
  color: "#3f3f46",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 20px",
};

const codeBox = {
  backgroundColor: "#f4f4f5",
  borderRadius: "6px",
  padding: "20px",
  textAlign: "center" as const,
  margin: "30px 0",
};

const codeText = {
  color: "#09090b",
  fontSize: "24px",
  fontWeight: "700",
  letterSpacing: "2px",
};

const footer = {
  color: "#71717a",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "20px",
};
