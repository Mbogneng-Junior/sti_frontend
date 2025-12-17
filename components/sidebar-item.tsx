"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

type Props = {
  label: string;
  iconSrc: string;
  href: string;
};

export const SidebarItem = ({ label, iconSrc, href }: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Button
      variant={active ? "SidebarOutline" : "Sidebar"}
      className="justify-start h-[52px]"
      asChild
    >
      <Link href={href} className="flex items-center">
        <Image
          src={iconSrc}
          alt={`${label} icon`}
          width={32}
          height={32}
          className="mr-5"
        />
        {label}
      </Link>
    </Button>
  );
};
