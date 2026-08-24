import { Navbar } from "@/app/components/navbar";
import { Hero } from "@/app/components/sections/hero";
import { About } from "@/app/components/sections/about";
import { Experience } from "@/app/components/sections/experience";
import { Skills } from "@/app/components/sections/skills";
import { Projects } from "@/app/components/sections/projects";
import { Contact } from "@/app/components/sections/contact";
import { MessagesSection as Messages } from "@/app/components/sections/messages";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Messages />
        <Contact />
      </main>
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto max-w-6xl">
          © {new Date().getFullYear()} Sabbir Hossen. Built with Next.js,
          Tailwind & Framer Motion.
        </div>
      </footer>
    </>
  );
}