import { ArrowRight } from 'lucide-react'; // Assuming you're using Lucide React icons
import Link from 'next/link';

export function GetStartedSection() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-background p-4">
      {/* Main Heading */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
        Get AI Skills Through
      </h1>

      {/* Subheading */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-custom-orange mb-8">
        Empower Certifications
      </h2>

      {/* Call-to-Action Button */}
      <Link
        href="/get-started"
        className="inline-flex items-center justify-center px-8 py-4 bg-teal-50p text-white font-semibold text-lg rounded-full hover:bg-teal transition-colors shadow-lg hover:shadow-xl"
      >
        Get Started Now
        <ArrowRight className="ml-2 w-5 h-5" />
      </Link>
    </div>
  );
}