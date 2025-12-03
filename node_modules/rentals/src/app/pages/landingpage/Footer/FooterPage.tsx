import { ReactNode } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AppAwareNavbar from "../../../../../../../packages/utils/AppAwareNavbar";
import { getFooterSections } from "../../../../../../../packages/ui/Footer/getFooterSections";

import RRPackage from "./RRPackage";
import AboutRufrent from "./AboutRufrent";
import TenantsDoc from "./TenantsDoc";
import OwnersDoc from "./OwnersDoc";
import TermsAndConditions from "./TermsAndConditions";
import Team from "./Team";
import ContactUs from "./ContactUs";

import { FOOTER_PATH } from "../../../../../../../packages/config/constants"

// Type for section → component mapping
type SectionComponentMap = Record<string, ReactNode>;

const sectionComponents: SectionComponentMap = {
  "about-us": <AboutRufrent />,
  "rr-package": <RRPackage />,
  tenants: <TenantsDoc />,
  owners: <OwnersDoc />,
  "terms-and-conditions": <TermsAndConditions />,
  team: <Team />,
  "contact-us": <ContactUs />,
};

interface FooterSectionItem {
  id: string;
  label: string;
  content?: ReactNode;
}

const FooterPage: React.FC = () => {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const urlParams = new URLSearchParams(search);
  const currentApp = (urlParams.get("app") || "rentals") as "rentals" | "studio";

  const allowedSections = getFooterSections(currentApp);

  const footerSections: FooterSectionItem[] = allowedSections.map((item) => ({
    ...item,
    content: sectionComponents[item.id] || <div>Content not found</div>,
  }));

  const activeSection =
    footerSections.find((s) => s.id === section) || footerSections[0];

  return (
    <>
      <AppAwareNavbar />

      <div className="container mx-auto p-6 pt-0.5">
        {/* Sticky Tabs */}
        <div className="fixed top-0 left-0 w-full mt-[72px] lg:mt-20 bg-white border-b z-10">
          <div className="flex justify-center overflow-x-auto scrollbar-hide">
            <div className="grid grid-cols-4 sm:grid-cols-2 md:flex space-x-1 px-2 py-1 md:py-2 flex-wrap">
              {footerSections.map((item) => (
                <button
                  key={item.id}
                  className={`px-4 py-1 text-sm font-semibold ${
                    item.id === activeSection.id
                      ? "rounded-lg text-white bg-blue-500"
                      : "text-[#001433]"
                  }`}
                  onClick={() =>
                    navigate(`${FOOTER_PATH}/${item.id}?app=${currentApp}`)
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-28 md:mt-20">{activeSection.content}</div>
      </div>
    </>
  );
};

export default FooterPage;
