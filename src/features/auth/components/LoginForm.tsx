import React from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function LoginForm() {
  return (
    <form className="bg-white p-8 rounded-lg shadow-md space-y-6">
      <div className="space-y-6">
        <Input type="email" placeholder="Email" label="Email" id="email" />
        <Input
          type="password"
          placeholder="Password"
          label="Password"
          id="password"
        />
      </div>

      <Button text="Login" />
      <p className="text-center ">
        Don't have an account? <span className="text-[#137fec]">Sign up</span>
      </p>
    </form>
  );
}

export default LoginForm;
