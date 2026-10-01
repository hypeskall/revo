import { Contact } from "@/types";
import { RevolutLogo } from "@/components/ui/RevolutLogo";

export function ContactAvatar({
  contact,
  className = "reference-contact-avatar",
}: {
  contact: Contact;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{ background: contact.avatarColor || "#36343e" }}
    >
      {contact.avatarUrl ? (
        <img src={contact.avatarUrl} alt="" />
      ) : (
        contact.initials
      )}
      <i>
        {contact.badge === "Salt" ? (
          <span className="salt-badge">Salt</span>
        ) : (
          <RevolutLogo variant="black" />
        )}
      </i>
    </span>
  );
}
