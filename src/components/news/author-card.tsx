import type { Author } from "@/lib/types";

export function AuthorCard({ author }: { author: Author }) {
  return (
    <div className="mt-12 p-6 bg-surface border border-border rounded-md flex items-center gap-4">
      <div
        className="size-14 rounded-full border border-border shrink-0"
        style={{ background: author.avatarColor }}
      />
      <div>
        <p className="font-semibold">{author.name}</p>
        <p className="text-sm text-muted-foreground">{author.role}</p>
      </div>
    </div>
  );
}
