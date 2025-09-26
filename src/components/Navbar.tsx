"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "💰 Savings",
      href: "/",
      description: "Track your savings in USD, EGP, and Gold",
    },
    {
      label: "🍎 Calories",
      href: "/calories",
      description: "Track your calorie intake and weight loss journey",
    },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">
              Personal Tracker
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const isActive = 
                (item.href === "/" && pathname === "/") ||
                (item.href !== "/" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  title={item.description}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
