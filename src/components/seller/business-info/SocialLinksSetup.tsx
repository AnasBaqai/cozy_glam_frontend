import React, { useRef, useState } from "react";
import SocialModal from "./SocialModal";
import {
  SocialLinksSetupProps,
  SocialPlatform,
  SOCIAL_PLATFORM_DATA,
} from "../../../types/business.types";

const SocialLinksSetup: React.FC<SocialLinksSetupProps> = ({
  socials,
  setSocial,
}) => {
  const [modal, setModal] = useState<SocialPlatform | null>(null);
  const [socialInput, setSocialInput] = useState("");
  const instagramRef = useRef<HTMLDialogElement>(null);
  const facebookRef = useRef<HTMLDialogElement>(null);
  const tiktokRef = useRef<HTMLDialogElement>(null);

  const openModal = (platform: SocialPlatform) => {
    setModal(platform);
    setSocialInput(socials[platform]);
    const ref =
      platform === "instagram"
        ? instagramRef
        : platform === "facebook"
        ? facebookRef
        : tiktokRef;
    ref.current?.showModal();
  };

  const closeModal = (platform: SocialPlatform) => {
    setModal(null);
    const ref =
      platform === "instagram"
        ? instagramRef
        : platform === "facebook"
        ? facebookRef
        : tiktokRef;
    ref.current?.close();
  };

  const saveSocial = () => {
    if (modal) {
      setSocial(modal, socialInput);
      closeModal(modal);
    }
  };

  // Array of social platforms to map over
  const platforms: SocialPlatform[] = ["instagram", "facebook", "tiktok"];

  return (
    <div className="md:col-span-2">
      <div className="text-glam-dark font-medium mb-2">Social Media Links</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <div
            key={platform}
            className="border border-gray-200 rounded-xl p-4 hover:border-glam-primary cursor-pointer flex items-center space-x-3"
            onClick={() => openModal(platform)}
          >
            <img
              src={SOCIAL_PLATFORM_DATA.icons[platform]}
              alt={platform}
              className="w-6 h-6 object-contain"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-glam-dark">
                {SOCIAL_PLATFORM_DATA.labels[platform]}
              </div>
              <div className="text-xs text-gray-500">
                {socials[platform] ? "Set" : "Not set"}
              </div>
            </div>
            <button
              type="button"
              className="text-glam-primary hover:text-glam-dark text-sm"
            >
              {socials[platform] ? "Edit" : "Add"}
            </button>
          </div>
        ))}
      </div>
      {/* Modals */}
      <SocialModal
        open={modal === "instagram"}
        dialogRef={instagramRef}
        platform="instagram"
        value={socialInput}
        onChange={setSocialInput}
        onSave={saveSocial}
        onClose={() => closeModal("instagram")}
      />
      <SocialModal
        open={modal === "facebook"}
        dialogRef={facebookRef}
        platform="facebook"
        value={socialInput}
        onChange={setSocialInput}
        onSave={saveSocial}
        onClose={() => closeModal("facebook")}
      />
      <SocialModal
        open={modal === "tiktok"}
        dialogRef={tiktokRef}
        platform="tiktok"
        value={socialInput}
        onChange={setSocialInput}
        onSave={saveSocial}
        onClose={() => closeModal("tiktok")}
      />
    </div>
  );
};

export default SocialLinksSetup;
