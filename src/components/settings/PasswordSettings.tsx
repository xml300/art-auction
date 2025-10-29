import PasswordForm from "./PasswordForm";
import { cookies } from "next/headers";

export default async function PasswordSettings() {
    const cookie = await cookies();
    const errors = cookie.get('errors')?.value || ""; 
 
    return (
       <PasswordForm errors={errors} />
    );
}
