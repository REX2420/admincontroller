"use client";
import React from "react";
import "../../globals.css";
import "@mantine/core/styles.css";
import {
  AppShell,
  Burger,
  Button,
  Group,
  MantineProvider,
  Text,
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { MdOutlineCategory, MdSpaceDashboard } from "react-icons/md";
import { IoListCircleSharp } from "react-icons/io5";
import { FaTable } from "react-icons/fa";
import { BsPatchPlus } from "react-icons/bs";
import { RiCoupon3Fill } from "react-icons/ri";
import { VscGraph } from "react-icons/vsc";
import { FaRegRectangleList, FaUsers } from "react-icons/fa6";
import { ImUsers } from "react-icons/im";
import Link from "next/link";
import { ModalsProvider } from "@mantine/modals";
import Logo from "@/components/Logo";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure();

  return (
    <MantineProvider>
      <ModalsProvider>
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
          }}
          padding={"md"}
        >
          <AppShell.Header>
            <Group h={"100%"} px={"md"}>
              <Burger
                opened={mobileOpened}
                onClick={toggleMobile}
                hiddenFrom="sm"
                size={"sm"}
              />
              <Burger
                opened={desktopOpened}
                onClick={toggleDesktop}
                visibleFrom="sm"
                size={"sm"}
              />
              <Logo />
              <Link href={"/admin/dashboard/topbars"}>
                <Button variant={"outline"}>TopBars</Button>
              </Link>
              <Link href={"/admin/dashboard/homescreenoffers"}>
                <Button variant="outline">Home Screen Offers</Button>
              </Link>
              <Link href={"/admin/dashboard/reviews"}>
                <Button variant="outline">Manage product reviews</Button>
              </Link>
            </Group>
          </AppShell.Header>
          <AppShell.Navbar p={"md"}>
            <div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/admin/dashboard"}>
                  <MdSpaceDashboard size={20} />
                </Link>
                <Link href={"/admin/dashboard"}>
                  <div className="">Admin Dashboard</div>
                </Link>
              </div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/admin/dashboard/users"}>
                  <ImUsers size={20} />
                </Link>
                <Link href={"/admin/dashboard/users"}>
                  <div className="">Users</div>
                </Link>
              </div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/admin/dashboard/vendors"}>
                  <FaUsers size={20} />
                </Link>
                <Link href={"/admin/dashboard/vendors"}>
                  <div className="">Vendors</div>
                </Link>
              </div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/admin/dashboard/coupons"}>
                  <RiCoupon3Fill size={20} />
                </Link>
                <Link href={"/admin/dashboard/coupons"}>
                  <div className="">Coupons</div>
                </Link>
              </div>
              <div className="">Orders:</div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/admin/dashboard/orders"}>
                  <IoListCircleSharp size={20} />
                </Link>
                <Link href={"/admin/dashboard/orders"}>
                  <div className="">Orders</div>
                </Link>
              </div>
              <div className="">Products:</div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/admin/dashboard/product/all/tabular"}>
                  <FaTable size={20} />
                </Link>
                <Link href={"/admin/dashboard/product/all/tabular"}>
                  <div className="">All Products</div>
                </Link>
              </div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/admin/dashboard/product/create"}>
                  <BsPatchPlus size={20} />
                </Link>
                <Link href={"/admin/dashboard/product/create"}>
                  <div className="">Create product</div>
                </Link>
              </div>
              <div className="">Categories:</div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/admin/dashboard/categories"}>
                  <MdOutlineCategory size={20} />
                </Link>
                <Link href={"/admin/dashboard/categories"}>
                  <div className="">Categories</div>
                </Link>
              </div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/admin/dashboard/subCategories"}>
                  <MdOutlineCategory
                    size={20}
                    style={{ transform: "rotate(180deg)" }}
                  />
                </Link>
                <Link href={"/admin/dashboard/subCategories"}>
                  <div className="">Sub Categories</div>
                </Link>
              </div>
              <div className="">Analytics:</div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/admin/dashboard/analytics/order"}>
                  <VscGraph size={20} />
                </Link>
                <Link href={"/admin/dashboard/analytics/order"}>
                  <div className="">Order Analytics</div>
                </Link>
              </div>
              <div className="">Banners:</div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/admin/dashboard/banners/website"}>
                  <FaRegRectangleList size={20} />
                </Link>
                <Link href={"/admin/dashboard/banners/website"}>
                  <div className="">Website Banners</div>
                </Link>
              </div>
              <div className="flex gap-[30px] items-center p-[10px] rounded-md hover:bg-blue-100">
                <Link href={"/admin/dashboard/banners/app"}>
                  <FaRegRectangleList size={20} />
                </Link>
                <Link href={"/admin/dashboard/banners/app"}>
                  <div className="">App Banners</div>
                </Link>
              </div>
            </div>
          </AppShell.Navbar>
          <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
      </ModalsProvider>
    </MantineProvider>
  );
}
