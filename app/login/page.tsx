import type { Metadata } from "next";
import LoginForm from "@/components/Login/login";

export const metadata: Metadata = {
  title: "Sign In | STS V2.0",
  description: "ระบบติดตามบริหารงานลูกค้า Service Tracking Systems V2.0",
};

export default function LoginPage() {
  return <LoginForm />;
}