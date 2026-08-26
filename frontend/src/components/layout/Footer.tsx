import { Link } from 'react-router-dom';
import { ArrowLeftRight, Globe, Mail } from 'lucide-react';

const COMPANY_LINKS = [
  { to: '/how-it-works', label: 'About Us' },
  { href: 'mailto:hello@remitcompare.com', label: 'Contact' },
  { href: '#', label: 'Provider API' },
];

const LEGAL_LINKS = [
  { href: '#', label: 'Privacy Policy' },
  { href: '#', label: 'Terms of Service' },
  { href: '#', label: 'Cookie Policy' },
];

export function Footer() {
  return (
    <footer className="w-full py-section-gap bg-deep-navy">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-lg px-gutter max-w-container-max mx-auto">

        {/* Brand */}
        <div className="col-span-1 flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 text-white font-display font-bold text-headline-sm">
            <ArrowLeftRight size={22} className="text-vibrant-green" />
            RemitCompare
          </Link>
          <p className="text-label-sm text-surface-variant opacity-70 mt-auto pt-4 border-t border-white/10">
            © {new Date().getFullYear()} RemitCompare. All rights reserved.
            <br />Precise rates for global citizens.
          </p>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-2">
          <h4 className="text-label-lg font-semibold text-white mb-2">Company</h4>
          {COMPANY_LINKS.map((link) =>
            'to' in link ? (
              <Link
                key={link.label}
                to={link.to as string}
                className="text-body-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-vibrant-green transition-all"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-body-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-vibrant-green transition-all"
              >
                {link.label}
              </a>
            ),
          )}
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-2">
          <h4 className="text-label-lg font-semibold text-white mb-2">Legal</h4>
          {LEGAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-body-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-vibrant-green transition-all"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Socials */}
        <div className="flex flex-col gap-4 items-start md:items-end">
          <h4 className="text-label-lg font-semibold text-white">Connect</h4>
          <div className="flex gap-4 text-surface-variant">
            <a href="#" className="hover:text-vibrant-green transition-colors" aria-label="Website">
              <Globe size={20} />
            </a>
            <a href="mailto:hello@remitcompare.com" className="hover:text-vibrant-green transition-colors" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
          <p className="text-label-sm text-surface-variant opacity-60 text-right">
            Rates updated every 15 minutes.<br />
            Not financial advice.
          </p>
        </div>

      </div>
    </footer>
  );
}
