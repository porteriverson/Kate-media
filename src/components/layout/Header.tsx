"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { CloseIcon, MenuIcon } from "@/components/icons/Icons";
import { navLinks } from "@/content/site";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Header
   Sticky site header. On mobile it collapses into a full-screen menu.
   Nav links come from src/content/site.ts.
   --------------------------------------------------------------------------- */

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Adds a soft border + blur once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes (including via the
  // browser's back button). Adjusting state during render like this is React's
  // recommended pattern for "reset state when a prop changes".
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  // Stop the page behind the mobile menu from scrolling, and allow Esc to close.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-cocoa-100 bg-cream/85 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 lg:px-8">
        <Logo priority />

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "relative text-sm transition-colors duration-300 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-blush-400 after:transition-all after:duration-300",
                isActive(link.href)
                  ? "text-ink after:w-full"
                  : "text-cocoa-500 after:w-0 hover:text-ink hover:after:w-full",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="/contact" size="md">
            Work with me
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="-mr-2 rounded-full p-2 text-ink transition-colors hover:bg-cocoa-50 md:hidden"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-100%)] overflow-y-auto border-t border-cocoa-100 bg-cream px-6 py-8 md:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "border-b border-cocoa-100 py-4 font-heading text-2xl transition-colors",
                isActive(link.href) ? "text-blush-600" : "text-ink hover:text-cocoa-600",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button href="/contact" size="lg" className="mt-8 w-full">
          Work with me
        </Button>
      </div>
    </header>
  );
}
