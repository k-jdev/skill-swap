import { createMetadata } from "@/shared/lib/createMetadata";
import UserInfo from "@/features/profile/components/UserInfo";
import Skills from "@/features/profile/components/Skills";
import Reviews from "@/features/profile/components/Reviews";

export const metadata = createMetadata("Profile", "Your profile page");

export default function ProfilePage() {
  return (
    <div className="mx-[240px] mt-10 min-h-screen rounded-4xl bg-white shadow-md">
      <UserInfo />
      <Skills />
      <Reviews />
    </div>
  );
}
