import { API_URL_LOCAL } from "@/lib/constants";
import { Card, CardContent, Separator } from "@elearning/ui";
import { User } from "@elearning/lib/models";
import { cookies } from "next/headers";
import ChangePassword from "./change-password";
import ProfileUpdate from "./profile-update";
import JobProfile from "./job-profile";

const getUser = async () => {
  const url = `${API_URL_LOCAL}/profile`;
  const resp = await fetch(url, {
    headers: {
      Cookie: cookies().toString(),
    },
    next: { revalidate: 10 },
  });

   console.log("The response profile: ", resp.json());
  return resp.ok ? ((await resp.json()) as User) : null;
};

export default async function SettingPage() {
  const user = await getUser();
  console.log("The user: ", user);

  if (!user) {
    return null;
  } 

  return (
    <Card className="shadow-none">
      <CardContent className="px-6 py-4">
        <ProfileUpdate user={user} />
        <Separator />
        <ChangePassword />
        <JobProfile user={user}/>
      </CardContent>
    </Card>
  );
}
