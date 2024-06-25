import React from "react";
import ContactForm from "./_components/ContactForm";
import BankDetailForm from "./_components/BankDetailForm";

const page = () => {
  return (
    <div className="p-6 py-10">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="w-full md:w-1/2">
          <ContactForm />
        </div>
        <div className="w-full md:w-1/2">
          <BankDetailForm />
        </div>
      </div>
    </div>
  );
};

export default page;
