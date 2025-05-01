import React from "react";
import FormInput from "./FormInput";

interface BusinessInfoFieldsProps {
  form: {
    storeName: string;
    storeDescription: string;
    storeLogo: string;
    businessEmail: string;
    businessPhone: string;
    businessAddress: string;
    country: string;
    city: string;
    state: string;
    website: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BusinessInfoFields: React.FC<BusinessInfoFieldsProps> = ({
  form,
  onChange,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-2">
    <FormInput
      label="Store name"
      name="storeName"
      value={form.storeName}
      required
      onChange={onChange}
      requiredMark
    />
    <FormInput
      label="Store description"
      name="storeDescription"
      value={form.storeDescription}
      required
      onChange={onChange}
      requiredMark
    />
    <FormInput
      label="Store logo URL"
      name="storeLogo"
      value={form.storeLogo}
      required
      onChange={onChange}
      requiredMark
    />
    <FormInput
      label="Business e-mail"
      name="businessEmail"
      type="email"
      value={form.businessEmail}
      required
      onChange={onChange}
      requiredMark
    />
    <FormInput
      label="Business phone"
      name="businessPhone"
      type="tel"
      value={form.businessPhone}
      required
      onChange={onChange}
      requiredMark
    />
    <FormInput
      label="Business address"
      name="businessAddress"
      value={form.businessAddress}
      required
      onChange={onChange}
      requiredMark
    />
    <FormInput
      label="Country"
      name="country"
      value={form.country}
      required
      onChange={onChange}
      requiredMark
    />
    <FormInput
      label="City"
      name="city"
      value={form.city}
      required
      onChange={onChange}
      requiredMark
    />
    <FormInput
      label="State"
      name="state"
      value={form.state}
      required
      onChange={onChange}
      requiredMark
    />
    <FormInput
      label="Website"
      name="website"
      value={form.website}
      onChange={onChange}
      placeholder="(optional)"
    />
  </div>
);

export default BusinessInfoFields;
