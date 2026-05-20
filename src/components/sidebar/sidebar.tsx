import { NewsletterForm } from "./newsletter-form";
import { AIToolsList } from "./ai-tools-list";
import { PopularTags } from "./popular-tags";

export function Sidebar() {
  return (
    <aside className="space-y-10">
      <NewsletterForm />
      <AIToolsList />
      <PopularTags />
    </aside>
  );
}
