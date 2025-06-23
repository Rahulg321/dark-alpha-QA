import {
  Body,
  Button,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { Container } from "@react-email/components";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

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
  return (
    <Html>
      <Head>
        <title>New Contact Form Message</title>
      </Head>
      <Preview>
        New message from {firstName} {lastName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Text style={heading}>New Contact Message</Text>
            <Text style={paragraph}>
              You have received a new message through the contact form:
            </Text>

            <Section style={detailsContainer}>
              <Text style={detailsHeading}>Contact Details:</Text>
              <Text style={detailsText}>
                <strong>First Name:</strong> {firstName}
              </Text>
              <Text style={detailsText}>
                <strong>Last Name:</strong> {lastName}
              </Text>
              <Text style={detailsText}>
                <strong>Email:</strong> {email}
              </Text>
            </Section>

            <Section style={detailsContainer}>
              <Text style={detailsHeading}>Message:</Text>
              <Text style={detailsText}>{message}</Text>
            </Section>

            <Hr style={hr} />
            <Text style={paragraph}>
              You can reply directly to this email to respond to the message.
            </Text>

            <Button style={button} href={`${baseUrl}`}>
              Back to home
            </Button>

            <Hr style={hr} />
            <Text style={footer}>
              Extractr Inc., 123 Tech Street, San Francisco, CA 94122
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

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
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const logo = {
  margin: "0 auto",
  marginBottom: "20px",
};

const heading = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const detailsContainer = {
  backgroundColor: "#f4f7fa",
  borderRadius: "4px",
  padding: "24px",
  marginBottom: "24px",
};

const detailsHeading = {
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "12px",
};

const detailsText = {
  margin: "3px 0",
};

const button = {
  backgroundColor: "#656ee8",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  marginTop: "16px",
};
