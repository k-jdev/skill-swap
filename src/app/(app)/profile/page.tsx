import React from "react";
import UserInfo from "@/features/profile/components/UserInfo";
import Skills from "@/features/profile/components/Skills";
import Reviews from "@/features/profile/components/Reviews";

function ProfilePage() {
  return (
    <div className="mt-10 bg-white  mx-[240px] rounded-4xl shadow-md min-h-screen">
      <UserInfo />
      <Skills />
      <Reviews />
    </div>
  );
}

export default ProfilePage;
