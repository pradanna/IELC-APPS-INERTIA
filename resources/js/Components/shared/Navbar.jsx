import { Link } from "@inertiajs/react";
import { Bell, Search, Menu } from "lucide-react";
import { useState } from "react";
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar({ user, onToggleSidebar, sidebarExpanded }) {
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    return (
        <nav className="h-16 flex items-center justify-between px-3.5 sm:px-6 bg-white border-b border-gray-200 sticky top-0 z-30">
            {/* Left: Sidebar Toggle & Search Bar */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-lg">
                {onToggleSidebar && (
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none shrink-0"
                        title={sidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
                        aria-label="Toggle navigation"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                )}

                <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search
                                className="w-4 h-4 text-gray-400"
                                aria-hidden="true"
                            />
                        </span>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            className="block w-full rounded-lg focus:outline-none py-2 border-gray-200 pl-9 text-xs sm:text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 bg-gray-50/50 focus:bg-white transition-all"
                            placeholder="Search everything..."
                        />
                    </div>
                </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-3 sm:space-x-5">
                {user ? (
                    <>
                        <NotificationDropdown user={user} />

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setProfileDropdownOpen((prev) => !prev)
                                }
                                className="flex items-center space-x-2"
                            >
                                <img
                                    src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${user.name.replace(
                                        " ",
                                        "+",
                                    )}`}
                                    alt="User avatar"
                                    className="w-9 h-9 rounded-full"
                                />
                                <div className="text-left hidden md:block">
                                    <div className="text-sm font-medium text-gray-800">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {user.role}
                                    </div>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {profileDropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 focus:outline-none"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu-button"
                                    tabIndex="-1"
                                >
                                    <div className="py-1" role="none">
                                        <Link
                                            href={route("profile.edit")}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                            tabIndex="-1"
                                        >
                                            Your Profile
                                        </Link>
                                        <Link
                                            href="#" // Replace with settings route
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                            tabIndex="-1"
                                        >
                                            Settings
                                        </Link>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                            tabIndex="-1"
                                        >
                                            Sign out
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route("login")}
                            className="text-sm font-medium text-gray-600 hover:text-primary-600"
                        >
                            Sign In
                        </Link>
                        <Link
                            href={route("register")}
                            className="text-sm font-medium text-white bg-primary-600 px-3 py-1.5 rounded-lg hover:bg-primary-700"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
