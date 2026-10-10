"use client";

import { api } from "@/lib/api";
import { CollectorProfile } from "@/types";
import { Camera, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ProfileForm({ errors }: { errors?: string }) {
  const [profile, setProfile] = useState({
    surname: "",
    firstName: "",
    username: "",
    email: "",
    bio: "",
    profilePicture: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get<CollectorProfile>("/profile");
        setProfile({ ...response });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [id]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfile((prevProfile) => ({
        ...prevProfile,
        profilePicture: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
  };

  return (
    <form
      method="POST"
      action="/api/profile"
      onSubmit={handleSubmit}
      className="p-6 space-y-4 max-w-xl text-left"
      encType="multipart/form-data"
    >
      {errors && (
        <div
          className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors}</span>
        </div>
      )}

      {/* Avatar Picker */}
      <div className="flex items-center gap-4 pb-2">
        <label htmlFor="profile_picture" className="relative group cursor-pointer shrink-0">
          <Image
            src={profile.profilePicture || "/logo.png"}
            width={80}
            height={80}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-border-subtle"
            alt="Profile Avatar"
          />
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/50 text-white">
            <Camera className="w-5 h-5" />
          </div>
        </label>
        <div>
          <span className="text-xs font-semibold text-text block">Profile Avatar</span>
          <span className="text-[11px] text-text-muted">Click image to upload new avatar</span>
        </div>
        <input
          type="file"
          className="hidden"
          name="profile_picture"
          id="profile_picture"
          onChange={handleFileChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          id="firstName"
          name="first_name"
          value={profile.firstName}
          onChange={handleChange}
          placeholder="First name"
        />
        <Input
          label="Surname"
          type="text"
          id="surname"
          name="surname"
          value={profile.surname}
          onChange={handleChange}
          placeholder="Surname"
        />
      </div>

      <Input
        label="Username"
        type="text"
        id="username"
        name="username"
        value={profile.username}
        onChange={handleChange}
        placeholder="Username"
      />

      <Input
        label="Email Address"
        type="email"
        id="email"
        name="email"
        value={profile.email}
        onChange={handleChange}
        placeholder="Email address"
      />

      <div className="space-y-1.5">
        <label
          htmlFor="bio"
          className="block text-xs font-semibold uppercase tracking-wider text-text-muted"
        >
          Collector Bio
        </label>
        <textarea
          rows={4}
          id="bio"
          name="about_you"
          value={profile.bio}
          onChange={handleChange}
          placeholder="Tell other collectors about your art tastes..."
          className="w-full rounded-xl border border-border-subtle bg-surface text-text text-sm p-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted/60"
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
