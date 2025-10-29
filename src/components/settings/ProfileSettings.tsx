import ProfileForm from "./ProfileForm";
import { cookies } from "next/headers";

export default async function ProfileSettings() {
    const cookie = await cookies();
    const errors = cookie.get('errors')?.value;

    return (
        <ProfileForm errors={errors} />
    );
}
