import React from "react";
import { Button, Input } from "@/components/ui";
import Link from "next/link";

function LoginForm() {
  return (
    <form className="bg-white p-8 rounded-xl shadow-xl space-y-6">
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
      <p className="text-center font-medium ">
        Don't have an account?{" "}
        <span className="text-[#137fec] cursor-pointer hover:text-[#137fec]/80">
          <Link href="/register">Sign up</Link>
        </span>
      </p>
    </form>
  );
}

export default LoginForm;
