import React from "react";
import LoginForm from "@/features/auth/components/LoginForm";
import AuthLayout from "../layout";
import HeaderBlock from "@/features/auth/components/HeaderBlock";
function LoginPage() {
  return (
    <AuthLayout>
      <HeaderBlock />
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
