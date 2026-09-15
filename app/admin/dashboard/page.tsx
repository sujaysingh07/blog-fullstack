import Dashboard from "@/src/components/dashboard";
import Header from "@/src/components/header";
import Sidebar from "@/src/components/sidebar";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header stays fixed at the top of this column */}
        <Header />

        {/* flex-1 pushes it to take remaining height, overflow-y-auto makes it scrollable */}
        <main className="flex-1 overflow-y-auto bg-muted/40">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}
