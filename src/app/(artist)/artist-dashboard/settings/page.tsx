import SettingsLayout from "@/components/SettingsLayout";
import PasswordSettings from "@/components/settings/PasswordSettings";
import ProfileSettings from "@/components/settings/ProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import ThemeSettings from "@/components/settings/ThemeSettings";

export const metadata = {
  title: "Artist Studio Settings | Artsyl",
  description: "Configure your credentials, artist bio, notifications, and theme settings",
};

export default function ArtistSettingsPage() {
  return (
    <SettingsLayout>
      <PasswordSettings />
      <ProfileSettings />
      <NotificationSettings />
      <ThemeSettings />
    </SettingsLayout>
  );
}
