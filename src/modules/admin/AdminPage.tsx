import { useState } from "react";

import { AdminSidebar } from "./components/AdminSidebar";
import { EventsTab } from "./components/EventsTab";
import { UsersTab } from "./components/UsersTab";
import type { AdminTab } from "./types";

function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("users");

  return (
    <div className='flex min-h-screen bg-background text-foreground'>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className='flex-grow p-8 overflow-y-auto'>
        {activeTab === "users" && <UsersTab />}
        {activeTab === "events" && <EventsTab />}
      </main>
    </div>
  );
}

export default AdminPage;
