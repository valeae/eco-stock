import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import LogoHeader from "@/components/shared/LogoHeader";

export const metadata: Metadata = {
  title: "Iniciar Sesión | EcoStock",
  description: "Iniciar sesión en la plataforma EcoStock",
};

export default function LoginPage() {
  return (
    <>
      <LogoHeader />
      <div className="z-10 max-w-md w-full">
        <LoginForm />
      </div>
    </>
  );
}
