import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LuLayoutDashboard, LuUtensilsCrossed, LuCalendarDays, LuShoppingCart,
  LuUser, LuSettings, LuUsers, LuClipboardList, LuNotebookText,
  LuStore, LuLogOut, LuSearch, LuBell, LuSun, LuMoon, LuMenu,
} from "react-icons/lu";

const icons = {
  overview: <LuLayoutDashboard size={20} />,
  restaurants: <LuUtensilsCrossed size={20} />,
  reserve: <LuCalendarDays size={20} />,
  cart: <LuShoppingCart size={20} />,
  profile: <LuUser size={20} />,
  admin: <LuSettings size={20} />,
  users: <LuUsers size={20} />,
  orders: <LuClipboardList size={20} />,
  menu: <LuNotebookText size={20} />,
  reservations: <LuCalendarDays size={20} />,
  manageRestaurants: <LuStore size={20} />,
  dashboard: <LuLayoutDashboard size={20} />,
  logout: <LuLogOut size={20} />,
};

function NavItem({ to, label, icon, onClick }) {
  const location = useLocation();
  const active = location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <Link to={to} className={`sidebarLink ${active ? "active" : ""}`} onClick={onClick}>
      <span className="sidebarIcon">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function getPageTitle(pathname, role) {
  const map = {
    "/dashboard": "Dashboard",
    "/restaurants": "Restaurants",
    "/restaurant/": "Restaurant",
    "/reservation": "Reserve Table",
    "/checkout": "Checkout",
    "/profile": "Profile",
    "/admin": "Admin Dashboard",
    "/admin/users": "Manage Users",
    "/admin/owners": "Manage Owners",
    "/admin/customers": "Manage Customers",
    "/admin/restaurants": "Manage Restaurants",
    "/admin/menus": "Manage Menus",
    "/admin/orders": "Manage Orders",
    "/owner": "Owner Dashboard",
    "/restaurants/manage": "Manage Restaurants",
    "/menu": "Manage Menu",
    "/orders": "Manage Orders",
    "/reservations/manage": "Manage Reservations",
    "/order-confirmation/": "Order Receipt",
    "/about": "About Us",
    "/contact": "Contact",
  };
  for (const [path, title] of Object.entries(map)) {
    if (pathname === path || pathname.startsWith(path)) return title;
  }
  return role === "admin" ? "Admin" : role === "owner" ? "Owner" : "Dashboard";
}

function getEyebrow(pathname, role) {
  if (role === "admin") return "Administration";
  if (role === "owner") return "Operations";
  if (pathname === "/profile") return "Account";
  return "Overview";
}

function Navbar({ theme, toggleTheme, cartCount, currentUser, logout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const closeMenu = () => setMenuOpen(false);
  const isOwner = currentUser?.role === "owner";
  const isAdmin = currentUser?.role === "admin";

  if (currentUser) {
    const initials = currentUser.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "DH";

    const mainLinks = isAdmin
      ? [{ to: "/admin", label: "Admin Dashboard", icon: icons.admin }]
      : isOwner
      ? [
          { to: "/owner", label: "Dashboard", icon: icons.dashboard },
          { to: "/restaurants/manage", label: "Restaurants", icon: icons.manageRestaurants },
          { to: "/menu", label: "Menu", icon: icons.menu },
          { to: "/orders", label: "Orders", icon: icons.orders },
          { to: "/reservations/manage", label: "Reservations", icon: icons.reservations },
        ]
      : [
          { to: "/dashboard", label: "Dashboard", icon: icons.overview },
          { to: "/restaurants", label: "Restaurants", icon: icons.restaurants },
          { to: "/reservation", label: "Reserve Table", icon: icons.reserve },
          { to: "/checkout", label: `Cart (${cartCount})`, icon: icons.cart },
        ];

    const adminLinks = [
      { to: "/admin/users", label: "Users", icon: icons.users },
      { to: "/admin/owners", label: "Owners", icon: icons.users },
      { to: "/admin/customers", label: "Customers", icon: icons.user },
      { to: "/admin/restaurants", label: "Restaurants", icon: icons.restaurants },
      { to: "/admin/menus", label: "Menus", icon: icons.menu },
      { to: "/admin/orders", label: "Orders", icon: icons.orders },
    ];

    const accountLinks = [
      { to: "/profile", label: "Profile", icon: icons.profile },
    ];

    const pageTitle = getPageTitle(location.pathname, currentUser.role);
    const eyebrow = getEyebrow(location.pathname, currentUser.role);

    return (
      <>
        <aside className={`appSidebar ${menuOpen ? "open" : ""}`}>
          <div className="sidebarBrand">
            <Link to={isAdmin ? "/admin" : "/dashboard"} onClick={closeMenu}>
              Dine<span>Hub</span>
            </Link>
          </div>

          <nav className="sidebarNav" aria-label="Workspace navigation">
            <div className="sidebarGroup">
              {isAdmin && <p className="sidebarSectionLabel">Main</p>}
              {mainLinks.map((item) => (
                <NavItem key={item.to} to={item.to} label={item.label} icon={item.icon} onClick={closeMenu} />
              ))}
            </div>

            {isAdmin && (
              <div className="sidebarGroup">
                <p className="sidebarSectionLabel">Management</p>
                {adminLinks.map((item) => (
                  <NavItem key={item.to} to={item.to} label={item.label} icon={item.icon} onClick={closeMenu} />
                ))}
              </div>
            )}

            <div className="sidebarGroup">
              <p className="sidebarSectionLabel">Account</p>
              {accountLinks.map((item) => (
                <NavItem key={item.to} to={item.to} label={item.label} icon={item.icon} onClick={closeMenu} />
              ))}
            </div>
          </nav>

          <div className="sidebarUser">
            <span className="avatar">{initials}</span>
            <div>
              <strong>{currentUser.name}</strong>
              <small>{currentUser.role}</small>
            </div>
          </div>
        </aside>

        <header className="appTopbar">
          <div className="topbarLeft">
            <button
              className="mobileMenuButton"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle workspace navigation"
            >
              <LuMenu size={24} />
            </button>
            <div>
              <p className="topbarEyebrow">{eyebrow}</p>
              <h2>{pageTitle}</h2>
            </div>
          </div>

          <div className="topbarActions">
            <div className="topbarSearch">
              <span className="searchIcon"><LuSearch size={16} /></span>
              <input type="text" placeholder="Search..." className="searchInput" />
            </div>

            <div className="notifContainer">
              <button className="iconButton notifButton" onClick={() => setNotifOpen((o) => !o)} title="Notifications" aria-label="Notifications">
                <LuBell size={20} />
                <span className="notifBadge">3</span>
              </button>
              {notifOpen && (
                <div className="notifDropdown">
                  <p className="notifHeader">Notifications</p>
                  <div className="notifItem">
                    <span>New order received</span>
                    <small>2m ago</small>
                  </div>
                  <div className="notifItem">
                    <span>Table reservation confirmed</span>
                    <small>1h ago</small>
                  </div>
                  <div className="notifItem">
                    <span>Payment completed</span>
                    <small>3h ago</small>
                  </div>
                </div>
              )}
            </div>

            <button className="iconButton textIconButton" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
              {theme === "dark" ? <LuSun size={20} /> : <LuMoon size={20} />}
            </button>

            <Link to="/profile" className="accountButton" onClick={closeMenu}>
              <span className="avatar">{initials}</span>
              <span className="accountInfo">
                <strong>{currentUser.name}</strong>
                <small>{currentUser.role}</small>
              </span>
            </Link>

            <button className="logoutBtn" onClick={() => { logout(); closeMenu(); }} title="Logout">
              <LuLogOut size={20} />
            </button>
          </div>
        </header>

        {menuOpen && <button className="sidebarBackdrop" aria-label="Close navigation" onClick={closeMenu} />}
        {notifOpen && <button className="sidebarBackdrop" aria-label="Close notifications" onClick={() => setNotifOpen(false)} />}
      </>
    );
  }

  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/restaurants", label: "Restaurants" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="navbar">
      <div className="navBrand">
        <Link to="/" className="brand" onClick={closeMenu}>
          Dine<span className="brandAccent">Hub</span>
        </Link>
      </div>
      <button className="mobileMenuButton" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation menu">
        {menuOpen ? "Close" : "Menu"}
      </button>
      <ul className={`navLinks ${menuOpen ? "open" : ""}`}>
        {publicLinks.map((item) => {
          const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
          return (
            <li key={item.to}>
              <Link to={item.to} className={isActive ? "active" : ""} onClick={closeMenu}>{item.label}</Link>
            </li>
          );
        })}
      </ul>
      <div className="navActions">
        <button className="iconButton textIconButton" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
          {theme === "dark" ? <LuSun size={20} /> : <LuMoon size={20} />}
        </button>
        <Link to="/checkout" className="cartButton" onClick={closeMenu}>
          Cart
          <span>{cartCount}</span>
        </Link>
        <Link to="/login" onClick={closeMenu}>
          <button className="secondaryBtn">Login</button>
        </Link>
        <Link to="/register" onClick={closeMenu}>
          <button className="primaryBtn">Register</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
