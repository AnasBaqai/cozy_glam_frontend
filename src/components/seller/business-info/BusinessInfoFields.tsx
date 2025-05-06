import React from "react";
import FormInput from "./FormInput";
import { BusinessInfoFieldsProps } from "../../../types/business.types";

const BusinessInfoFields: React.FC<BusinessInfoFieldsProps> = ({
  form,
  onChange,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-2">
    {/* Store Name and Description - Side by side */}
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

    {/* Business Email and Phone - Side by side */}
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

    {/* Business Address - Full width */}
    <FormInput
      label="Business address"
      name="businessAddress"
      value={form.businessAddress}
      required
      onChange={onChange}
      requiredMark
      className="md:col-span-2"
    />

    {/* Country and City - Side by side */}
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

    {/* State and Postal Code - Side by side */}
    <FormInput
      label="State/Province"
      name="state"
      value={form.state}
      required
      onChange={onChange}
      requiredMark
    />
    <FormInput
      label="Postal Code"
      name="postalCode"
      value={form.postalCode}
      required
      onChange={onChange}
      requiredMark
    />

    {/* Website - Full width */}
    <FormInput
      label="Website"
      name="website"
      value={form.website}
      onChange={onChange}
      placeholder="(optional)"
      className="md:col-span-2"
    />
  </div>
);

export default BusinessInfoFields;
