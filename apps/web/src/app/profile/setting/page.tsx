import { API_URL_LOCAL } from "@/lib/constants";
import { Card, CardContent, Separator } from "@elearning/ui";
import { User } from "@elearning/lib/models";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChangePassword from "./change-password";
import ProfileUpdate from "./profile-update";
import JobProfile from "./job-profile";

const getUser = async () => {
  const url = `${API_URL_LOCAL}/profile`;
  const resp = await fetch(url, {
    headers: {
      Cookie: cookies().toString(),
    },
  });

  return resp.ok ? ((await resp.json()) as User) : null;
};

export default async function Setting() {
  const user = await getUser();
  console.log("The user from the be", user);

  if (!user) {
    redirect("/");
  }

  return (
    <Card className="shadow-none">
      <CardContent className="px-6 py-4">
        <ProfileUpdate user={user} />
        <Separator />
        <ChangePassword />
        <Separator />
        <JobProfile user={user}/>
      </CardContent>
    </Card>
  );
}
