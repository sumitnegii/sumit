import { profile } from "@/data/portfolio";
import { RoyalSealStamp } from "@/components/site/RoyalSealStamp";

export function Footer() {
  const links = [
    { label: "GitHub", href: profile.github },
    { label: "LinkedIn", href: profile.linkedin },
    { label: "Resume", href: profile.resumeUrl },
    { label: "Email", href: `mailto:${profile.email}` },
  ];

  return (
    <footer className="relative border-t border-border/60 bg-[oklch(0.06_0.003_60_/_0.85)] px-5 pt-8 pb-8 sm:px-8 sm:pt-10 sm:pb-9">
      <div className="mx-auto max-w-6xl">
        {/* ── Main Signature Row (Left: Identity · Center: Seal · Right: Spacer for Bran) ── */}
        <div className="grid grid-cols-1 items-center gap-6 text-center sm:grid-cols-3 sm:text-left">
          {/* LEFT: Identity & Quote */}
          <div className="space-y-1">
            <p className="font-display text-sm tracking-[0.32em] text-gold-gradient uppercase font-medium">
              {profile.name}
            </p>
            <p className="font-mono text-[0.58rem] tracking-[0.24em] text-muted-foreground/80 uppercase">
              {profile.title}
            </p>
            <p className="text-xs text-muted-foreground/60 italic pt-0.5 max-w-xs mx-auto sm:mx-0">
              &ldquo;The realm is vast. There is always something left to build.&rdquo;
            </p>
          </div>

          {/* CENTER: The SS Wax Seal Signature */}
          <div className="flex items-center justify-center">
            <RoyalSealStamp size={58} />
          </div>

          {/* RIGHT: Visual Balance Anchor */}
          <div className="hidden sm:flex items-center justify-end">
            <div className="text-right space-y-0.5 opacity-40">
              <p className="font-mono text-[0.55rem] tracking-[0.24em] uppercase text-gold-dim">
                THE RECORD
              </p>
              <p className="font-mono text-[0.5rem] tracking-[0.18em] uppercase text-muted-foreground">
                ARCHIVED · MMXXVI
              </p>
            </div>
          </div>
        </div>

        {/* ── Subtle Divider ── */}
        <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent" />

        {/* ── Bottom Bar: Links & Copyright ── */}
        <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <p className="font-mono text-[0.56rem] tracking-[0.2em] text-muted-foreground/50 uppercase">
            © {new Date().getFullYear()} {profile.name}
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="font-display text-[0.62rem] tracking-[0.24em] text-muted-foreground/75 uppercase transition-colors duration-300 hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
