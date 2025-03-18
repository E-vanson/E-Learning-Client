import { Mail, Phone } from 'lucide-react'; // Assuming you're using Lucide React icons
import Image from 'next/image';

export function GetInTouchSection() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-background"> {/* Centering container */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8"> {/* Constrain width and add padding */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative w-full h-64 md:h-96 order-1 md:order-none">
            <div className="aspect-w-16 aspect-h-9">
              <Image
                src={require("@elearning/assets/images/intouch.png")} // Replace with your image path
                alt="Contact Us"
                fill
                className="object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right Side - Contact Information */}
          <div className="space-y-6 text-center md:text-left order-0 md:order-none">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Get In Touch
            </h2>

            {/* Email Section */}
            <div className="flex flex-col items-center md:items-start space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-6 h-6 text-primary" />
                <span className="text-lg font-medium">Email Us</span>
              </div>
              <a
                href="mailto:info@empower"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                info@empower
              </a>
            </div>

            {/* Phone Section */}
            <div className="flex flex-col items-center md:items-start space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-6 h-6 text-primary" />
                <span className="text-lg font-medium">Call Us</span>
              </div>
              <a
                href="tel:+254712345678"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                +254 712 345 678
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}