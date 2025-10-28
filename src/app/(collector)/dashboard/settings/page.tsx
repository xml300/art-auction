import SettingsLayout from "@/components/SettingsLayout";
import PasswordSettings from "@/components/settings/PasswordSettings";
import ProfileSettings from "@/components/settings/ProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import ThemeSettings from "@/components/settings/ThemeSettings";

export default function SettingsPage() {
    return (
        <SettingsLayout>
            <PasswordSettings />
            <ProfileSettings />
            <NotificationSettings />
            <ThemeSettings />
        </SettingsLayout>
    );
}
