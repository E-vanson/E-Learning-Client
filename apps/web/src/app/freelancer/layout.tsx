import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@elearning/ui";
import { BookText, Bookmark, Settings, User, ContactRound, BookCheck ,Ticket, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

const iconSize = 20;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  function menuLink({
    href,
    title,
    icon,
  }: {
    href: string;
    title: string;
    icon: ReactNode;
  }) {
    return (
      <Link href={href} className={"flex p-2 items-center text-foreground hover:text-primary"}>
        {icon}
        <span>{title}</span>
      </Link>
    );
  }

  const content = (
    <>
      <div className="text-muted-foreground px-1 mb-2 text-sm uppercase hidden lg:block ">
        Freelancer Dashboard
      </div>
      <div className="flex flex-col gap-1">        
        {menuLink({
          href: "/freelancer/applications",
          title: "Applications",
          icon: <ContactRound className="me-2" size={iconSize} />,
        })}
        {menuLink({
          href: "/freelancer/conracts",
          title: "Contracts",
          icon: <Ticket className="me-2" size={iconSize} />,
        })}
        {menuLink({
          href: "/freelancer/reviews",
          title: "Reviews",
          icon: <BookCheck className="me-2" size={iconSize} />,
        })}       
        
      </div>
    </>
  );

  return (
    <div className="container py-5 mb-5">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <div className="border rounded-md bg-card">
            <div className="block lg:hidden">
              <Accordion type="multiple">
                <AccordionItem value="menu">
                  <AccordionTrigger className="px-3 py-2 font-semibold text-lg">
                    Menu
                  </AccordionTrigger>
                  <AccordionContent className="border-t pb-0">
                    <div className="p-3">{content}</div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="p-3 hidden lg:block">{content}</div>
          </div>
        </div>
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
