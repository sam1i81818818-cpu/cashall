import PickupPolicyPage, { metadata as baseMetadata } from "../pickup-policy/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Doorstep Pickup Policy | CashALL (Aarna Enterprise)",
  alternates: {
    canonical: "https://www.cashall.in/doorstep-pickup-policy",
  },
};

export default PickupPolicyPage;
