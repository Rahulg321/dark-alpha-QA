import * as React from "react";

interface TwoFactorEmailProps {
  token: string;
}

export const TwoFactorEmail: React.FC<Readonly<TwoFactorEmailProps>> = ({
  token,
}) => (
  <div>
    <h1 className="text-red-400">2 Factor Authentication by OCR!!!!</h1>
    <hr />
    <h2>Check your Code Below 👇</h2>
    <strong className="">{token}</strong>
  </div>
);
