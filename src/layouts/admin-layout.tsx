import {
  Briefcase,
  Code2,
  FileText,
  FolderKanban,
  GraduationCap,
  Home,
  LayoutDashboard,
  Mail,
  User,
} from "lucide-react";
import type { PropsWithChildren } from "react";
import { AppSidebarTemplate } from "#/components/sections/sidebar/app-sidebar-template";
import type { BreadcrumbItem, GroupNavItem, NavItem } from "#/types";

type Props = PropsWithChildren<{
  breadcrumbs?: BreadcrumbItem[];
}>;

const mainItems: GroupNavItem[] = [
  {
    title: "Aperçu",
    icon: LayoutDashboard,
    isShow: true,
    children: [
      {
        href: "/dashboard",
        title: "Tableau de bord",
        isShow: true,
        icon: Home,
      },
    ],
  },
  {
    title: "Parcours",
    icon: Briefcase,
    isShow: true,
    children: [
      {
        href: "/admin/profiles",
        title: "Profil professionnel",
        isShow: true,
        icon: User,
      },
      {
        href: "/admin/works",
        				title: "Expériences",
        isShow: true,
        icon: Briefcase,
      },
      {
        href: "/admin/educations",
        				title: "Formations",
        isShow: true,
        icon: GraduationCap,
      },
    ],
  },
  {
    title: "Réalisations",
    icon: FolderKanban,
    isShow: true,
    children: [
      {
        href: "/admin/projects",
        				title: "Projets",
        isShow: true,
        icon: FolderKanban,
      },
      {
        href: "/admin/skills",
        title: "Compétences",
        isShow: true,
        icon: Code2,
      },
    ],
  },
  {
    title: "Documents",
    icon: FileText,
    isShow: true,
    children: [
      {
        href: "/admin/cvs",
        title: "CVs",
        isShow: true,
        icon: FileText,
      },
    ],
  },
  {
    title: "Contact",
    icon: Mail,
    isShow: true,
    children: [
      {
        href: "/admin/contact",
        title: "Me contacter",
        isShow: true,
        icon: Mail,
      },
    ],
  },
];

const navUserItems: NavItem[] = [
  {
    title: "Tableau de bord",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    		title: "Expériences",
    icon: Briefcase,
    href: "/admin/works",
  },
  {
    		title: "Formations",
    icon: GraduationCap,
    href: "/admin/educations",
  },
  {
    title: "Projets",
    icon: FolderKanban,
    href: "/admin/projects",
  },
  {
    title: "Mon profil",
    icon: User,
    href: "/profile",
  },
];

export const AdminLayout: React.FC<Props> = ({
  children,
  breadcrumbs = [],
}) => {
  return (
    <AppSidebarTemplate
      navUserItems={navUserItems}
      mainItems={mainItems}
      breadcrumbs={breadcrumbs}
    >
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        {children}
      </div>
    </AppSidebarTemplate>
  );
};
