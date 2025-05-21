import React from "react";
import QRCode from "react-qr-code";

const StudentsPage: React.FC = () => {
  return (
    <div>
      <QRCode value="w" />
    </div>
  );
};

export default StudentsPage;
