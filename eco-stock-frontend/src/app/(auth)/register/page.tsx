import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import LogoHeader from "@/components/shared/LogoHeader";

export const metadata: Metadata = {
  title: "Registro | EcoStock",
  description: "Registro en la plataforma EcoStock",
};

export default function LoginPage() {
  return (
    <>
      <LogoHeader />
      <div className="z-10 max-w-md w-full">
        <RegisterForm />
      </div>
    </>
  );
}
