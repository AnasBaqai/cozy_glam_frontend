import React from "react";
import {
  SocialModalProps,
  SOCIAL_PLATFORM_DATA,
} from "../../../types/business.types";

const SocialModal: React.FC<SocialModalProps> = ({
  open,
  dialogRef,
  platform,
  value,
  onChange,
  onSave,
  onClose,
}) => (
  <dialog ref={dialogRef} className="modal" open={open ? true : undefined}>
    <div className="modal-box max-w-md p-8 bg-white shadow-lg rounded-2xl">
      <h3 className="font-bold text-xl text-glam-dark mb-6">
        Set your {SOCIAL_PLATFORM_DATA.labels[platform]} link
      </h3>
      <div className="form-control w-full mb-8">
        <input
          type="url"
          className="input input-bordered w-full h-12 focus:outline-none focus:border-glam-primary"
          placeholder={`Enter your ${SOCIAL_PLATFORM_DATA.labels[platform]} profile URL`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="text-xs text-gray-500 mt-2">
          Example: {SOCIAL_PLATFORM_DATA.exampleUrls[platform]}
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-8">
        <button
          className="btn bg-transparent hover:bg-gray-100 text-gray-700 border-gray-300"
          type="button"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary bg-glam-primary hover:bg-glam-dark border-none px-8"
          type="button"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
    <div className="modal-backdrop" onClick={onClose}>
      <button className="hidden">close</button>
    </div>
  </dialog>
);

export default SocialModal;
