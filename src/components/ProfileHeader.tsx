import Image from "next/image";
import Link from "next/link";
import { Twitter, Instagram } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  username: string;
  profilePicture: string;
  bio: string;
  socialMedia: {
    twitter?: string;
    instagram?: string;
  };
}

export default function ProfileHeader({
  name,
  username,
  profilePicture,
  bio,
  socialMedia,
}: ProfileHeaderProps) {
  return (
    <section className="bg-surface rounded-2xl border border-border-subtle shadow-xs p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div className="shrink-0">
        <Image
          src={profilePicture}
          alt={name}
          width={100}
          height={100}
          className="rounded-full object-cover ring-4 ring-surface-elevated"
        />
      </div>
      <div className="flex-1 text-center sm:text-left space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-text">{name}</h2>
            <p className="text-xs text-text-muted">@{username}</p>
          </div>
          <div className="flex justify-center sm:justify-start gap-2">
            {socialMedia.twitter && (
              <Link
                href={socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-border-subtle bg-surface-elevated text-text-muted hover:text-primary transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </Link>
            )}
            {socialMedia.instagram && (
              <Link
                href={socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-border-subtle bg-surface-elevated text-text-muted hover:text-rose-500 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
        {bio && (
          <p className="text-xs text-text-muted leading-relaxed max-w-2xl">{bio}</p>
        )}
      </div>
    </section>
  );
}
