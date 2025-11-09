// components/layout/header.tsx
'use client';

import { WalletConnector } from "@/components/ui/wallet-connector";
import Link from "next/link";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Notifications } from "@/components/notifications/notifications";

export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="border-b lg:hidden">
      <div className="container flex items-center h-16 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold">TON Web3</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Notifications />
          <WalletConnector />
        </div>
      </div>
    </header>
  );
}