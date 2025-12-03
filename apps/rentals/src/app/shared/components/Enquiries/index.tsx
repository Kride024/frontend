import React from "react";
import Navbar from "../Navbar/Navbar";
import EnquiryManagementDashboard from "./EnquiryDashboard"; 

const EnquiriesView: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <EnquiryManagementDashboard />
      </main>
    </div>
  );
};

export default EnquiriesView;
