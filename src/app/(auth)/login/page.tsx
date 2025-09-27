import React from "react";
import LoginForm from "@/features/auth/components/LoginForm";
import AuthLayout from "../layout";
function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
