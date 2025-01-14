import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-fit">
      <div className="flex h-14 w-full justify-between items-center px-4 md:px-12 lg:px-24 xl:px-52">
        <div className="mr-4 hidden md:flex">
          <Link href={"/"} className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Songz</span>
          </Link>
          <nav className="flex w-full items-center gap-4 text-sm lg:gap-6">
            <Link
              href={"/"}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Entrega 1
            </Link>
            <Link
              href={"/entrega2"}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Entrega 2
            </Link>
          </nav>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
