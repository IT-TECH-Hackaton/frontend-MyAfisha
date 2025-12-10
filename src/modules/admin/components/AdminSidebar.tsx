import { cn } from "@shared/lib/utils";
import { ThemeToggle } from "@shared/ui/theme-toggle";
import { AdminTab } from "../types";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

export const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const tabs = [
    { key: "users", label: "Пользователи" },
    { key: "events", label: "События" },
  ] as const;

  return (
    <aside className='w-[250px] flex flex-col p-5 flex-shrink-0 bg-secondary text-foreground border-r border-border'>
      <a href="/" className='mb-8 text-xl border-b border-border pb-2.5 text-foreground'>myAfisha Админка</a>
      <nav>
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={cn(
              "px-4 py-3 cursor-pointer rounded-md mb-2 transition-colors text-foreground",
              activeTab === tab.key
                ? "bg-primary/14 text-primary border border-border"
                : "hover:bg-muted/60"
            )}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </nav>
      <div className='mt-auto pt-6 border-t border-border'>
        <ThemeToggle />
      </div>
    </aside>
  );
};