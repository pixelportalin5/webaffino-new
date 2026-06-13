"use client";

import { useEffect, useState } from "react";
import ForminatorSignupModal from "@/components/ForminatorSignupModal";

export default function SiteOptimisationEnhancements() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const trigger = document.getElementById("cta-signup-trigger");
    if (!trigger) {
      return undefined;
    }

    const handleClick = (event) => {
      event.preventDefault();
      setModalOpen(true);
    };

    trigger.addEventListener("click", handleClick);

    return () => {
      trigger.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <ForminatorSignupModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
    />
  );
}
