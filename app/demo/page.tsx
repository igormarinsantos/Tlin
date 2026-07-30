"use client";

import { LeadQualificationPopup } from "@/components/LeadQualificationPopup";

export default function DemoPage() {
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
