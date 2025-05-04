import React, { useRef, useState, RefObject } from "react";
import SocialModal from "./SocialModal";

interface SocialLinksSetupProps {
  socials: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  setSocial: (
    platform: "instagram" | "facebook" | "tiktok",
    value: string
  ) => void;
}

const icons = {
  instagram: "/icons/instagram.png",
  facebook: "/icons/facebook.png",
  tiktok: "/icons/tiktok.png",
};

const platformLabels = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
};

const SocialLinksSetup: React.FC<SocialLinksSetupProps> = ({
  socials,
  setSocial,
}) => {
  const [modal, setModal] = useState<
    null | "instagram" | "facebook" | "tiktok"
  >(null);
  const [socialInput, setSocialInput] = useState("");
  const instagramRef = useRef<HTMLDialogElement>(
    null
  ) as RefObject<HTMLDialogElement>;
  const facebookRef = useRef<HTMLDialogElement>(
    null
  ) as RefObject<HTMLDialogElement>;
  const tiktokRef = useRef<HTMLDialogElement>(
    null
  ) as RefObject<HTMLDialogElement>;

  const openModal = (platform: "instagram" | "facebook" | "tiktok") => {
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

  const closeModal = (platform: "instagram" | "facebook" | "tiktok") => {
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

  return (
    <div className="md:col-span-2">
      <div className="text-glam-dark font-medium mb-2">Social Media Links</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["instagram", "facebook", "tiktok"] as const).map((platform) => (
          <div
            key={platform}
            className="border border-gray-200 rounded-xl p-4 hover:border-glam-primary cursor-pointer flex items-center space-x-3"
            onClick={() => openModal(platform)}
          >
            <img
              src={icons[platform]}
              alt={platform}
              className="w-6 h-6 object-contain"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-glam-dark">
                {platformLabels[platform]}
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
