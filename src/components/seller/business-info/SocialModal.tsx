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
    <div className="modal-box max-w-md p-6 bg-white shadow-lg rounded-2xl">
      <h3 className="font-bold text-base text-glam-dark mb-4">
        Set your {SOCIAL_PLATFORM_DATA.labels[platform]} link
      </h3>
      <div className="form-control w-full mb-6">
        <input
          type="url"
          className="input input-bordered w-full h-9 text-xs focus:outline-none focus:border-glam-primary"
          placeholder={`Enter your ${SOCIAL_PLATFORM_DATA.labels[platform]} profile URL`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="text-[10px] text-gray-500 mt-1">
          Example: {SOCIAL_PLATFORM_DATA.exampleUrls[platform]}
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          className="btn bg-transparent hover:bg-gray-100 text-gray-700 border-gray-300 h-8 min-h-0 text-xs px-4"
          type="button"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary bg-glam-primary hover:bg-glam-dark border-none h-8 min-h-0 text-xs px-6"
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
