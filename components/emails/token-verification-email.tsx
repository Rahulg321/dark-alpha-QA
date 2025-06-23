import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface TokenVerificationEmailProps {
  tokenConfirmLink: string;
}

export const TokenVerificationEmail: React.FC<
  Readonly<TokenVerificationEmailProps>
> = ({ tokenConfirmLink }) => (
  <Html>
    <Head />
    <Preview>Verify your email address for Diligence Dark Alpha</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to Diligence Dark Alpha</Heading>
        <Text style={text}>
          Please click the button below to verify your email address and
          complete your account setup.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={tokenConfirmLink}>
            Verify Email
          </Button>
        </Section>
        <Text style={text}>
          If you didn&apos;t request this email, there&apos;s nothing to worry
          about; you can safely ignore it.
        </Text>
        <Text style={footer}>
          ©2024 Diligence Dark Alpha. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default TokenVerificationEmail;

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

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#09090b",
  color: "#fafafa",
  fontSize: "16px",
  textDecoration: "none",
  borderRadius: "6px",
  padding: "14px 24px",
  display: "inline-block",
};

const footer = {
  color: "#71717a",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "20px",
};
