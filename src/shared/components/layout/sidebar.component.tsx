"use client";
import { ChevronRight, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { SessionResource } from "../../types/auth/session.type";
import {
  ChronoSidebar,
  ChronoSidebarContent,
  ChronoSidebarFooter,
  ChronoSidebarGroup,
  ChronoSidebarGroupLabel,
  ChronoSidebarHeader,
  ChronoSidebarMenu,
  ChronoSidebarMenuAction,
  ChronoSidebarMenuButton,
  ChronoSidebarMenuItem,
  ChronoSidebarMenuSub,
  ChronoSidebarMenuSubButton,
  ChronoSidebarMenuSubItem,
  ChronoSidebarRail,
} from "@chrono/chrono-sidebar.component";
import { ChronoNavUser } from "@chrono/chrono-nav-user.component";
import {
  ChronoCollapsible,
  ChronoCollapsibleContent,
  ChronoCollapsibleTrigger,
} from "@chrono/chrono-collapsible.component";
import AppIcons from "../icons.component";
import { EIconNames } from "../../enums/icon-names.enum";
import Image from "next/image";
import { useClientSession } from "@/src/lib/session-client";
import { useAuthStore } from "@/src/shared/stores/auth.store";

export default function SidebarComponent() {
  const pathname = usePathname();
  const router = useRouter();
  const {data} = useClientSession();
  const applications = useAuthStore((s) => s.applications);

  const isResourceWithoutSubresources = (resource: SessionResource) => {
    return resource.subresources.length === 0;
  };

  const handleRedirect = (path: string) => {
    router.push(path);
  };

  const normalizeToAbsolutePath = (p: string | undefined) => {
    if (!p) return "/parking";
    const clean = p.replace(/^\/+/, ""); // remove leading slashes
    // if the path already targets admin or parking, keep it absolute
    if (clean.startsWith("parking/") || clean.startsWith("parking/")) return `/${clean}`;
    return `/parking/${clean}`;
  };

  const renderResourceIcon = (icon: unknown) => {
    if (typeof icon === "string" && icon.length > 0) {
      return <AppIcons iconName={icon as EIconNames} />;
    }

    return <User />;
  };

  return (
    <ChronoSidebar collapsible="icon">
      <ChronoSidebarHeader className="mx-auto">
        <Image
          src="/img/BLACK_LOGO.png"
          alt="Logotipo ChronoPOS"
          width={82}
          height={82}
          className="block dark:hidden"
          priority
        />
        <Image
          src="/img/WHITE_LOGO.png"
          alt="Logotipo ChronoPOS (modo oscuro)"
          width={82}
          height={82}
          className="hidden dark:block"
          priority
        />{" "}
        {/* CompanySwitcher removed: companies are not part of the session anymore */}
      </ChronoSidebarHeader>
      <ChronoSidebarContent> 
        {applications.map((app) => (
          <ChronoSidebarGroup key={app.id}>
            <ChronoSidebarGroupLabel>{app.name}</ChronoSidebarGroupLabel>
            <ChronoSidebarMenu>
              {app.resources.map((res) => {
                const resPath = normalizeToAbsolutePath(res.path);
                const isActive = pathname.startsWith(resPath);

                return isResourceWithoutSubresources(res) ? (
                  <ChronoSidebarMenuItem key={res.id}>
                    <ChronoSidebarMenuButton
                      className={`cursor-pointer ${
                        isActive ? "bg-accent text-accent-foreground" : ""
                      }`}
                      onClick={() => handleRedirect(resPath)}
                    >
                      <AppIcons iconName={res.icon as EIconNames} />
                      {res.name}
                    </ChronoSidebarMenuButton>
                  </ChronoSidebarMenuItem>
                ) : (
                  <ChronoSidebarMenuItem key={res.id}>
                    <ChronoCollapsible defaultOpen={isActive}>
                      <div className="relative">
                        <ChronoSidebarMenuButton
                          className={`cursor-pointer ${
                            isActive ? "bg-accent text-accent-foreground" : ""
                          }`}
                          onClick={() => handleRedirect(resPath)}
                        >
                          {renderResourceIcon(res.icon)}
                          {res.name}
                        </ChronoSidebarMenuButton>

                        <ChronoCollapsibleTrigger asChild>
                          <ChronoSidebarMenuAction
                            className="group size-5"
                            aria-label={`Desplegar ${res.name}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ChevronRight className="size-5 transition-transform group-data-[state=open]:rotate-90" />
                          </ChronoSidebarMenuAction>
                        </ChronoCollapsibleTrigger>
                      </div>

                      <ChronoCollapsibleContent>
                        <ChronoSidebarMenuSub>
                          {res.subresources.map((subresource) => {
                            const subPath = normalizeToAbsolutePath(
                              subresource.path
                            );
                            const isSubActive = pathname.startsWith(subPath);
                            return (
                              <ChronoSidebarMenuSubItem key={subresource.id}>
                                <ChronoSidebarMenuSubButton
                                  className={
                                    isSubActive
                                      ? "bg-accent text-accent-foreground"
                                      : ""
                                  }
                                  onClick={() => handleRedirect(subPath)}
                                >
                                  {subresource.name}
                                </ChronoSidebarMenuSubButton>
                              </ChronoSidebarMenuSubItem>
                            );
                          })}
                        </ChronoSidebarMenuSub>
                      </ChronoCollapsibleContent>
                    </ChronoCollapsible>
                  </ChronoSidebarMenuItem>
                );
              })}
            </ChronoSidebarMenu>
          </ChronoSidebarGroup>
        ))}
      </ChronoSidebarContent>
      <ChronoSidebarFooter>
        <ChronoNavUser user={{
          name: data?.user.name || "Usuario",
          email: data?.user.email || "",
          avatar:  "",
        }} />
      </ChronoSidebarFooter>
      <ChronoSidebarRail />
    </ChronoSidebar>
  );
}
