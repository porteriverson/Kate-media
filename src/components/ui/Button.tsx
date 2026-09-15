import Link from "next/link";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Button
   The site's shared button. Renders as a link when `href` is given, and as a
   real <button> otherwise (e.g. the contact form's submit button).

   Variants:
     primary   pastel pink background, dark brown text — the main call to action
     secondary outlined, for the softer second option
     ghost     text-only with an underline on hover
     onDark    for use inside the dark brown CTA bands
   --------------------------------------------------------------------------- */

type Variant = "primary" | "secondary" | "ghost" | "onDark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition duration-300 ease-gentle disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-blush-300 text-cocoa-800 shadow-sm hover:bg-blush-400 hover:shadow-md hover:-translate-y-0.5",
  secondary:
    "border border-cocoa-300 text-ink hover:border-cocoa-500 hover:bg-cocoa-50 hover:-translate-y-0.5",
  ghost: "text-cocoa-600 underline-offset-4 hover:text-blush-600 hover:underline",
  onDark: "bg-cream text-cocoa-800 hover:bg-blush-200 hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonProps = CommonProps &
  ({ href: string } | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>));

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    base,
    variants[variant],
    variant === "ghost" ? "px-0 py-1 text-sm" : sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...rest } = props as { href: string };
    const isExternal = href.startsWith("http") || href.startsWith("mailto:");

    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          {...rest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
