import {
  Html,
  Body,
  Container,
  Text,
  Heading,
  Section,
  Hr,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
}

export const ContactEmail: React.FC<Readonly<ContactEmailProps>> = ({
  name,
  email,
  message,
}) => (
  <Html>
    <Tailwind>
      <Body className="bg-gray-100 font-sans">
        <Container className="bg-white border border-gray-200 rounded-lg shadow-md mx-auto my-10 p-8 w-[600px]">
          <Heading className="text-2xl font-bold text-gray-800">
            New Website Inquiry
          </Heading>
          <Text className="text-gray-600 text-base">
            You received a new message from your website contact form.
          </Text>
          <Hr className="border-gray-300 my-6" />
          <Section>
            <Text className="text-lg font-semibold text-gray-700">
              Sender's Name:
            </Text>
            <Text className="text-gray-800 bg-gray-50 p-3 rounded-md text-base">
              {name}
            </Text>
          </Section>
          <Section>
            <Text className="text-lg font-semibold text-gray-700 mt-4">
              Sender's Contact (Email/Phone):
            </Text>
            <Text className="text-gray-800 bg-gray-50 p-3 rounded-md text-base">
              {email}
            </Text>
          </Section>
          <Section>
            <Text className="text-lg font-semibold text-gray-700 mt-4">
              Message:
            </Text>
            <Text className="text-gray-800 bg-gray-50 p-3 rounded-md text-base leading-relaxed">
              {message}
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
