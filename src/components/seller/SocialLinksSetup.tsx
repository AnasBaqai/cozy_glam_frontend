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
    <div className="mt-4 mb-4">
      <div className="text-glam-dark font-medium mb-2">Set your socials</div>
      <div className="flex gap-4">
        {(["instagram", "facebook", "tiktok"] as const).map((platform) => (
          <button
            key={platform}
            type="button"
            aria-label={platform}
            className="transition hover:scale-110 focus:outline-none"
            onClick={() => openModal(platform)}
          >
            <img
              src={icons[platform]}
              alt={platform}
              className="w-8 h-8 object-contain"
            />
          </button>
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
