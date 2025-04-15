"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Twitter, Linkedin, Mail, Phone, Instagram } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.match(/^\/learn\/.+\/lessons\/.+/)) {
    return null;
  }

  const copyRight = `© ${new Date().getFullYear()} ${
    process.env.NEXT_PUBLIC_APP_NAME
  }`;

  return (
    <footer className="border-t bg-teal-50p">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          {/* About Section */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-lg font-semibold">About</h3>
            <div className="flex flex-col space-y-2">
              <Link
                href="/about-us"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/careers"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Careers
              </Link>
              <Link
                href="/jobs"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Jobs
              </Link>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="flex flex-col space-y-4">
              <Link
                href="mailto:info@empower"
                className="flex items-center justify-center md:justify-start md:items-start gap-2 text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-5 w-5" />
                info@empower
              </Link>
              <Link href="#" className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground hover:text-foreground">
                <Phone className="h-5 w-5" />
                +25412345678
                </Link>
              <div className="flex gap-4 justify-center md:justify-start">
                <Link href="#" className="text-muted-foreground hover:text-foreground justify-center md:justify-start">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground justify-center md:justify-start">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground justify-center md:justify-start">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground justify-center md:justify-start">
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-lg font-semibold">Privacy</h3>
            <div className="flex flex-col space-y-2">
              <Link
                href="/privacy-policy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t py-6">
          <div className="flex flex-col md:flex-row items-center  justify-center md:justify-between  gap-4 text-sm text-muted-foreground text-center">
            <div>{copyRight}</div>
            <div className="flex items-center gap-4">
              {/* <div className="text-nowrap">
                Made with &#9829; by{" "}
                <a
                  href="https://phyohtetarkar.github.io/"
                  className="text-primary underline font-medium"
                  target="_blank"
                >
                  Phyo Htet Arkar
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
