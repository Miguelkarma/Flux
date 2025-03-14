import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-transparent">
      <div className="container flex flex-col md:flex-row justify-between items-start gap-20 py-8 md:py-12">
        {/* Brand Section */}
        <div className="flex-1 space-y-4">
          <h2 className="font-DM Sans, sans-serif; font-bold text-2xl leading-[1.1] sm:text-2xl md:text-4xl bg-gradient-to-b from-teal-400 via-gray-400 to-gray-800 bg-clip-text text-transparent ">
            Miguelkarma
          </h2>
        </div>

        {/* Footer Grid */}
        <div className="flex flex-grow justify-end w-full">
          <div className="space-y-4 self-end">
            <h3 className="text-sm text-white font-medium">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/miguelkarma"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/paul-miguel-santos-17aa43320/"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
