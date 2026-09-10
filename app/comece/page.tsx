"use client";

import { LeadQualificationPopup } from "@/components/LeadQualificationPopup";

export default function ComecePage() {
  return (
    <main>
      <LeadQualificationPopup
        isOpen
        onClose={() => undefined}
        planName={null}
        embedded
      />
    </main>
  );
}
