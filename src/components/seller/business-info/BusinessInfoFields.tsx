import React, { useState, useEffect, ChangeEvent } from "react";
import FormInput from "./FormInput";
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";
import { BusinessInfoFieldsProps } from "../../../types/business.types";

const BusinessInfoFields: React.FC<BusinessInfoFieldsProps> = ({
  form,
  onChange,
}) => {
  const [countries] = useState<ICountry[]>(Country.getAllCountries());
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  // Update states when country changes
  useEffect(() => {
    if (form.country) {
      const countryData = countries.find((c) => c.name === form.country);
      if (countryData) {
        setStates(State.getStatesOfCountry(countryData.isoCode));
      } else {
        setStates([]);
      }
    } else {
      setStates([]);
    }
  }, [form.country, countries]);

  // Update cities when state changes
  useEffect(() => {
    if (form.country && form.state) {
      const countryData = countries.find((c) => c.name === form.country);
      const stateData = states.find((s) => s.name === form.state);
      if (countryData && stateData) {
        setCities(
          City.getCitiesOfState(countryData.isoCode, stateData.isoCode)
        );
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [form.country, form.state, countries, states]);

  // Custom change handler for select inputs
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name } = e.target;
    // Reset dependent fields when parent field changes
    if (name === "country") {
      onChange({
        target: { name: "state", value: "" },
      } as ChangeEvent<HTMLSelectElement>);
      onChange({
        target: { name: "city", value: "" },
      } as ChangeEvent<HTMLSelectElement>);
    } else if (name === "state") {
      onChange({
        target: { name: "city", value: "" },
      } as ChangeEvent<HTMLSelectElement>);
    }
    onChange(e);
  };

  return (
    <div className="space-y-6">
      {/* Store Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Address */}
      <div className="space-y-6">
        <FormInput
          label="Business address"
          name="businessAddress"
          value={form.businessAddress}
          required
          onChange={onChange}
          requiredMark
          placeholder="Street address"
          className="w-full"
        />

        <div className="grid grid-cols-2 gap-6">
          {/* Country Select */}
          <div>
            <label className="block text-sm font-medium text-glam-dark mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              name="country"
              value={form.country}
              onChange={handleSelectChange}
              required
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-glam-primary bg-white"
            >
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* State Select */}
          <div>
            <label className="block text-sm font-medium text-glam-dark mb-2">
              State/Province <span className="text-red-500">*</span>
            </label>
            <select
              name="state"
              value={form.state}
              onChange={handleSelectChange}
              required
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-glam-primary bg-white"
              disabled={!form.country}
            >
              <option value="">Select state</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* City Select */}
          <div>
            <label className="block text-sm font-medium text-glam-dark mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <select
              name="city"
              value={form.city}
              onChange={handleSelectChange}
              required
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-glam-primary bg-white"
              disabled={!form.state}
            >
              <option value="">Select city</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <FormInput
            label="Postal Code"
            name="postalCode"
            value={form.postalCode}
            required
            onChange={onChange}
            requiredMark
            placeholder="Enter postal code"
          />
        </div>
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
