// packages/ui/src/components/TabNavigation.tsx
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { STUDIO_BASE, PG_BASE } from "@packages/config/constants";

interface Tab {
  id: string;
  label: string;
  title: string;
  metaDescription: string;
  ogDescription: string;
  link: string;
}

const tabs: Tab[] = [
  {
    id: "/",
    label: "Rentals",
    title: "Rufrent - Best Property Rental Platform in Hyderabad",
    metaDescription: "Explore our rental properties and find your perfect home.",
    ogDescription: "Find & list apartments, houses, villas for rent in Hyderabad. 1000+ verified properties.",
    link: "https://www.rufrent.com/",
  },
  {
    id: STUDIO_BASE,
    label: "Studio",
    title: "Rufrent - Best studio spaces for your creative needs",
    metaDescription: "Discover our studio spaces for your creative needs.",
    ogDescription: "Explore creative studio spaces tailored for you.",
    link: "https://www.rufrent.com/studio",
  },
  {
    id: PG_BASE,
    label: "MyPG",
    title: "Rufrent - MyPg: Find & List PGs in Hyderabad",
    metaDescription: "Discover the best Paying Guest (PG) accommodations in Hyderabad.",
    ogDescription: "Find verified PGs, hostels, and shared rooms in Hyderabad.",
    link: "https://www.rufrent.com/mypg",
  },
];

const TabNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;

  useEffect(() => {
    const activeTab = tabs.find((tab) => tab.id === activePath) ?? tabs[0];

    document.title = activeTab.title;

    const setMeta = (name: string, content: string, attr: string = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", activeTab.metaDescription);
    setMeta("og:title", activeTab.title, "property");
    setMeta("og:url", activeTab.link, "property");
    setMeta("og:description", activeTab.ogDescription, "property");
  }, [activePath]);

  return (
    <div className="inline-flex flex-wrap bg-white/10 backdrop-blur-md p-1 gap-2 rounded-full mt-4 max-w-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => navigate(tab.id)}
          className={`px-4 py-2 md:px-6 font-medium text-sm rounded-full whitespace-nowrap transition-all duration-300 ${
            activePath === tab.id
              ? "text-amber-400 bg-white/15 shadow-md hover:bg-white/30"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
          aria-selected={activePath === tab.id}
          role="tab"
        >
          <span className={activePath === tab.id ? "font-bold" : ""}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;