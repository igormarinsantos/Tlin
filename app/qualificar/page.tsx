"use client";

import { LeadQualificationPopup } from "@/components/LeadQualificationPopup";

// Standalone form route for campaign links or a dedicated subdomain.
export default function QualificationPage() {
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
