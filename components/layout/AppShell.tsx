import type { ReactNode } from 'react';

type AppShellProps = {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
};

export function AppShell({ sidebar, header, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#06111f] text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1480px] grid-cols-1 lg:grid-cols-[196px_minmax(0,1fr)]">
        {sidebar}
        <div className="min-w-0 px-4 py-4 sm:px-6 lg:px-8">
          {header}
          <main className="space-y-8 pb-12">{children}</main>
        </div>
      </div>
    </div>
  );
}
