import React, { RefObject } from "react";

interface SocialModalProps {
  open: boolean;
  dialogRef: RefObject<HTMLDialogElement>;
  platform: "instagram" | "facebook" | "tiktok";
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const platformLabels = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
};
const exampleUrls = {
  instagram: "https://instagram.com/yourusername",
  facebook: "https://facebook.com/yourbusiness",
  tiktok: "https://tiktok.com/@yourusername",
};

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
        Set your {platformLabels[platform]} link
      </h3>
      <div className="form-control w-full mb-8">
        <input
          type="url"
          className="input input-bordered w-full h-12 focus:outline-none focus:border-glam-primary"
          placeholder={`Enter your ${platformLabels[platform]} profile URL`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="text-xs text-gray-500 mt-2">
          Example: {exampleUrls[platform]}
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
    <form method="dialog" className="modal-backdrop">
      <button className="hidden">close</button>
    </form>
  </dialog>
);

export default SocialModal;
