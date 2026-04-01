import { useState } from 'react';
import ChatWidget from './ChatWidget';
import Sidebar, { DashboardTopbar } from './Sidebar';

function AppFrame({ title, subtitle, children, withChat = true }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="page-wrap flex min-h-screen gap-5 py-4 lg:py-5">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="min-w-0 flex-1 pb-12">
        <DashboardTopbar title={title} subtitle={subtitle} onOpenMenu={() => setOpen(true)} />
        {children}
      </div>
      {withChat && <ChatWidget />}
    </div>
  );
}

export default AppFrame;
