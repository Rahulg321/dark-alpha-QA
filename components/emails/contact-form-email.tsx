import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ContactMessageEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export default function ContactMessageEmail({
  firstName,
  lastName,
  email,
  message,
}: ContactMessageEmailProps) {
  const previewText = `New message from ${firstName} ${lastName}`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Message</Heading>

          <Text style={text}>
            You have received a new message through the contact form on the
            Diligence Dark Alpha website.
          </Text>

          <Hr style={hr} />

          <Section>
            <Text style={subtleText}>
              <strong>From:</strong> {firstName} {lastName}
            </Text>
            <Text style={subtleText}>
              <strong>Email:</strong> {email}
            </Text>
          </Section>

          <Heading as="h2" style={h2}>
            Message:
          </Heading>
          <Text style={messageBox}>{message}</Text>

          <Hr style={hr} />

          <Text style={text}>
            You can reply directly to {email} to respond to this message.
          </Text>

          <Text style={footer}>
            ©2024 Diligence Dark Alpha. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

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
  textAlign: "center" as const,
};

const h2 = {
  color: "#18181b",
  fontSize: "20px",
  fontWeight: "600",
  margin: "30px 0 10px",
};

const text = {
  color: "#3f3f46",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 20px",
};

const subtleText = {
  color: "#71717a",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 5px",
};

const messageBox = {
  backgroundColor: "#f4f4f5",
  borderRadius: "6px",
  padding: "20px",
  color: "#3f3f46",
  fontSize: "16px",
  lineHeight: "1.5",
  whiteSpace: "pre-wrap",
};

const hr = {
  borderColor: "#e4e4e7",
  margin: "30px 0",
};

const footer = {
  color: "#71717a",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "20px",
};
