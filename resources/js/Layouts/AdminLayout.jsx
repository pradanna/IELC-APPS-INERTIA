import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Building2,
    BookCopy,
    Package,
    Users,
    UserCircle,
    Settings,
    ChevronFirst,
    ChevronLast,
    Headset,
    PhoneCall,
    FileText,
    CircleDollarSign,
    ClipboardCheck,
    GraduationCap,
} from "lucide-react";
import Navbar from "@/Components/shared/Navbar";
import Toast from "@/Components/ui/Toast";

// IELC Logo
const logoUrl = "/assets/images/local/IELC-Logo.webp";

const menuItems = [
    {
        category: "Main",
        items: [
            {
                icon: <LayoutDashboard size={20} />,
                text: "Dashboard",
                name: "admin.dashboard",
                href: route("admin.dashboard"),
            },
            {
                icon: <Headset size={20} />,
                text: "Crm",
                href: route("admin.crm.leads.index"),
                name: "admin.crm.leads.*",
            },
            {
                icon: <FileText size={20} />,
                text: "Placement Test",
                href: route("admin.placement-tests.index"),
                name: "admin.placement-tests.*",
            },
            // {
            //     icon: <PhoneCall size={20} />,
            //     text: "Follow Up",
            //     href: route("crm.follow-up.index"),
            //     name: "crm.follow-up.index",
            // },
        ],
    },
    {
        category: "Finance",
        items: [
            {
                icon: <CircleDollarSign size={20} />,
                text: "Overview",
                href: route("admin.finance.dashboard"),
                name: "admin.finance.dashboard",
            },
        ],
    },
    {
        category: "Management",
        items: [
            {
                icon: <BookCopy size={20} />,
                text: "Master",
                href: route("admin.master.index"),
                name: "admin.master.index",
            },
            {
                icon: <Building2 size={20} />,
                text: "Class",
                href: route("admin.study-classes.index"),
                name: "admin.study-classes.*",
            },
            {
                icon: <LayoutDashboard size={20} />,
                text: "Schedule",
                href: route("admin.schedules.index"),
                name: "admin.schedules.*",
            },
            {
                icon: <ClipboardCheck size={20} />,
                text: "Attendances",
                href: route("admin.attendances.index"),
                name: "admin.attendances.*",
            },
            {
                icon: <GraduationCap size={20} />,
                text: "Academic",
                href: route("admin.academic.index"),
                name: "admin.academic.*",
            },
        ],
    },
    {
        category: "Users",
        items: [
            {
                icon: <Users size={20} />,
                text: "Teachers",
                href: route("admin.teachers.index"),
                name: "admin.teachers.*",
            },
            {
                icon: <UserCircle size={20} />,
                text: "Students",
                href: route("admin.students.index"),
                name: "admin.students.*",
            },
        ],
    },
    {
        category: "System",
        items: [
            {
                icon: <Settings size={20} />,
                text: "Settings",
                href: "#",
                name: "settings",
            },
        ],
    },
];

const SidebarContext = React.createContext();

export default function AdminLayout({ children }) {
    // Default collapsed on medium / laptop screens (< 1280px) to maximize content space
    const [expanded, setExpanded] = React.useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("ielc_sidebar_expanded");
            if (saved !== null) {
                return JSON.parse(saved);
            }
            return window.innerWidth >= 1280;
        }
        return true;
    });

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const { auth } = usePage().props;
    const userRole = auth.user.role;

    const toggleExpanded = () => {
        setExpanded((curr) => {
            const next = !curr;
            if (typeof window !== "undefined") {
                localStorage.setItem("ielc_sidebar_expanded", JSON.stringify(next));
            }
            return next;
        });
    };

    const handleToggleSidebar = () => {
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
            setMobileOpen((prev) => !prev);
        } else {
            toggleExpanded();
        }
    };

    const filteredMenu = menuItems.filter(group => {
        if (userRole === 'superadmin') return true;
        
        if (userRole === 'frontdesk') {
            // Frontdesk sees Main and Management, but not Finance or System
            return ['Main', 'Management', 'Users'].includes(group.category);
        }

        return false;
    }).map(group => {
        if (userRole === 'frontdesk' && group.category === 'Management') {
            return {
                ...group,
                items: group.items.filter(item => 
                    !['Master'].includes(item.text)
                )
            };
        }
        return group;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row w-full overflow-x-hidden">
            {/* Mobile Backdrop Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar (Adaptive Desktop & Slide-out Mobile) */}
            <aside
                className={`
                    fixed top-0 bottom-0 left-0 z-50 lg:sticky lg:top-0 h-screen
                    transition-all duration-300 ease-in-out shrink-0
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    ${expanded ? "w-60 xl:w-64" : "w-[72px]"}
                `}
            >
                <nav className="h-full flex flex-col bg-black border-r border-gray-800 shadow-xl select-none">
                    <div
                        className={`p-4 flex items-center ${
                            expanded ? "justify-between" : "justify-center"
                        }`}
                    >
                        {expanded ? (
                            <img
                                src={logoUrl}
                                className="w-32 h-auto object-contain transition-all"
                                alt="IELC Logo"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-black text-sm">
                                I
                            </div>
                        )}
                        <button
                            onClick={toggleExpanded}
                            className={`p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors hidden lg:flex items-center justify-center ${
                                expanded ? "" : "hidden"
                            }`}
                            title={expanded ? "Collapse Sidebar" : "Expand Sidebar"}
                        >
                            <ChevronFirst size={18} />
                        </button>
                    </div>

                    <SidebarContext.Provider value={{ expanded }}>
                        <ul className="flex-1 px-3 overflow-y-auto overflow-x-hidden scrollbar-none py-2 space-y-0.5">
                            {filteredMenu.map((group, index) => (
                                <React.Fragment key={index}>
                                    {group.category && (
                                        <li
                                            className={`px-3 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 transition-all ${
                                                expanded ? "block" : "hidden"
                                            }`}
                                        >
                                            {group.category}
                                        </li>
                                    )}
                                    {!expanded && index > 0 && (
                                        <div className="my-2 border-t border-gray-800/80 mx-2" />
                                    )}
                                    {group.items.map((item, itemIndex) => (
                                        <SidebarItem
                                            key={itemIndex}
                                            {...item}
                                            active={route().current(item.name)}
                                            onItemClick={() => setMobileOpen(false)}
                                        />
                                    ))}
                                </React.Fragment>
                            ))}
                        </ul>
                    </SidebarContext.Provider>

                    {/* Bottom collapse button for icon-only mode */}
                    {!expanded && (
                        <div className="p-3 border-t border-gray-800 hidden lg:flex justify-center">
                            <button
                                onClick={toggleExpanded}
                                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                                title="Expand Sidebar"
                            >
                                <ChevronLast size={18} />
                            </button>
                        </div>
                    )}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 flex flex-col bg-gray-50 min-h-screen overflow-x-hidden">
                <Navbar
                    user={auth.user}
                    onToggleSidebar={handleToggleSidebar}
                    sidebarExpanded={expanded}
                />
                <Toast />
                <div className="flex-1 p-3.5 sm:p-5 lg:p-6 w-full max-w-full min-w-0">
                    {children}
                </div>
            </main>
        </div>
    );
}

export function SidebarItem({ icon, text, active, alert, href, onItemClick }) {
    const { expanded } = React.useContext(SidebarContext);

    return (
        <Link
            href={href}
            onClick={onItemClick}
            title={!expanded ? text : undefined}
            className={`
                relative flex items-center py-2.5 px-3 my-1
                font-medium rounded-lg cursor-pointer
                transition-all group
                ${expanded ? "justify-start" : "justify-center"}
                ${
                    active
                        ? "bg-primary-800 text-white shadow-sm"
                        : "hover:bg-primary-900 text-gray-400 hover:text-gray-200"
                }
            `}
        >
            <div className="shrink-0">{icon}</div>
            <span
                className={`overflow-hidden transition-all duration-300 whitespace-nowrap text-sm ${
                    expanded ? "w-44 ml-3 opacity-100" : "w-0 opacity-0"
                }`}
            >
                {text}
            </span>
            {alert && (
                <div
                    className={`absolute right-2 w-2 h-2 rounded bg-primary-400 ${
                        expanded ? "" : "top-2"
                    }`}
                />
            )}
        </Link>
    );
}
