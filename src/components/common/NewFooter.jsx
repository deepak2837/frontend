import { Twitter, Instagram, Linkedin } from "lucide-react";

export default function ModernFooter() {
  return (
    <footer className="bg-custom-gradient border-2 text-white py-2 px-4 rounded-t-[20px]">
      <div className="container mx-auto flex flex-col justify-center items-center">
        <div className="text-center w-full">
          <div className="flex justify-center items-center space-x-4">
            <a
              href="https://x.com/medgloss"
              className="text-gray-200 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://www.instagram.com/medgloss_official/"
              className="text-gray-200 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://www.linkedin.com/company/medgloss"
              className="text-gray-200 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
          <p className="text-xs mt-1">Made with ♥ in India</p>

          {/* Footer Links - compact and wrap on mobile */}
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 mt-2 mb-1 text-xs">
            <a
              href="/about"
              className="text-blue-200 underline hover:text-white transition-colors"
              aria-label="About Us"
            >
              About Us
            </a>
            <span className="hidden sm:inline">|</span>
            <a
              href="/contact"
              className="text-blue-200 underline hover:text-white transition-colors"
              aria-label="Contact Us"
            >
              Contact Us
            </a>
            <span className="hidden sm:inline">|</span>
            <a
              href="/privacy-policy"
              className="text-blue-200 underline hover:text-white transition-colors"
              aria-label="Privacy Policy"
            >
              Privacy Policy
            </a>
            <span className="hidden sm:inline">|</span>
            <a
              href="/terms-of-use"
              className="text-blue-200 underline hover:text-white transition-colors"
              aria-label="Terms of Use"
            >
              Terms of Use
            </a>
            <span className="hidden sm:inline">|</span>
            <a
              href="/disclaimer"
              className="text-blue-200 underline hover:text-white transition-colors"
              aria-label="Disclaimer"
            >
              Disclaimer
            </a>
          </div>

          {/* Contact Info - compact, stacked on mobile */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-x-4 gap-y-0.5 text-xs mt-1 mb-0">
            <a href="mailto:help@medgloss.com" className="hover:underline text-blue-100" aria-label="Email">
              help@medgloss.com
            </a>
            <span className="hidden sm:inline">|</span>
            <a href="tel:+919896887732" className="hover:underline text-blue-100" aria-label="Phone">
              +91 98968 87732
            </a>
          </div>

          <p className="text-sm">© 2025 MedGloss. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
