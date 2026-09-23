import { Suspense } from "react";
import VerifyEmailPage from "./VerifyEmailPage";

export default function VerifyEmailPageWrapper() {
  return (
    <Suspense>
      <VerifyEmailPage />
    </Suspense>
  );
}
