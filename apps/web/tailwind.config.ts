import sharedConfig from "@elearning/tailwind-config";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@elearning/ui/dist/**/*.js",
    "./node_modules/@elearning/block-editor/dist/**/*.js",
    "../../packages/config-tailwind/node_modules/@nextui-org/theme/dist/components/(navbar|listbox).js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#1e293b",
        accent: "#facc15",
        teal: "#008080",
        "teal-50p": "rgba(0, 128, 128, 0.5)",
        "custom-orange": "#E97451"
        
        

      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  presets: [sharedConfig],
};
export default config;
