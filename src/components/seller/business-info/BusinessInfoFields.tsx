import React from "react";
import FormInput from "./FormInput";
import { BusinessInfoFieldsProps } from "../../../types/business.types";

const BusinessInfoFields: React.FC<BusinessInfoFieldsProps> = ({
  form,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Store Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Store name"
          name="storeName"
          value={form.storeName}
          required
          onChange={onChange}
          requiredMark
          placeholder="Enter your store name"
        />
        <FormInput
          label="Store description"
          name="storeDescription"
          value={form.storeDescription}
          required
          onChange={onChange}
          requiredMark
          placeholder="Brief description of your store"
        />
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Business e-mail"
          name="businessEmail"
          type="email"
          value={form.businessEmail}
          required
          onChange={onChange}
          requiredMark
          placeholder="your@business.com"
        />
        <FormInput
          label="Business phone"
          name="businessPhone"
          type="tel"
          value={form.businessPhone}
          required
          onChange={onChange}
          requiredMark
          placeholder="+1 (555) 000-0000"
        />
      </div>

      {/* Website */}
      <FormInput
        label="Website"
        name="website"
        value={form.website}
        onChange={onChange}
        placeholder="https://your-website.com (optional)"
        className="w-full"
      />
    </div>
  );
};

export default BusinessInfoFields;
