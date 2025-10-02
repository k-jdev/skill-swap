"use client";
import React from "react";
import { Button, Input } from "@/components/ui";
import Link from "next/link";

function RegisterForm() {
  return (
    <form className="bg-white p-8 rounded-xl shadow-xl space-y-6">
      <div>
        {" "}
        <h1 className="text-2xl font-bold text-center text-black">
          Create your account
        </h1>
        <p className="text-center">
          Join our community and start sharing your skills!
        </p>
      </div>
      <div className="space-y-6">
        <Input type="name" placeholder="Name" label="Name" id="name" />
        <Input type="email" placeholder="Email" label="Email" id="email" />
        <Input
          type="password"
          placeholder="Password"
          label="Password"
          id="password"
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          label="Confirm Password"
          id="confirm-password"
        />
      </div>

      <Button text="Register" />
      <p className="text-center font-medium ">
        Already have an account?{" "}
        <span className="text-[#137fec] cursor-pointer hover:text-[#137fec]/80">
          <Link href="/login">Log in</Link>
        </span>
      </p>
    </form>
  );
}

export default RegisterForm;
