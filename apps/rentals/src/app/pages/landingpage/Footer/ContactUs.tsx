import { FC } from "react";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp, FaClock } from "react-icons/fa";
import tailwindStyles from "../../../../../../../packages/styles/tailwindStyles";

const ContactUs: FC = () => {
  return (
    <div className="max-w-4xl mt-20 lg:mt-12 mx-auto p-4 pt-2 bg-white rounded-lg border border-[#ffc107]">
      <h1 className={`${tailwindStyles.heading_2} font-semibold text-center`}>
        Contact Us
      </h1>

      <p className={`${tailwindStyles.paragraph} pt-2 pb-4 text-center`}>
        We’re here to assist you with all your rental needs.
      </p>

      <div className="bg-white/70 backdrop-blur-lg border border-gray-200 p-6 rounded-xl">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FaPhoneAlt className="text-blue-600 text-lg" />
            <p className={`${tailwindStyles.heading_4} font-semibold`}>
              Call Us:
              <a href="tel:+919985649278" className="text-blue-500 ml-1">
                +91-9985649278
              </a>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <FaEnvelope className="text-red-500 text-lg" />
            <p className={`${tailwindStyles.heading_4} font-semibold`}>
              Email Us:
              <a
                href="mailto:support@rufrent.com"
                className="text-blue-500 ml-1"
              >
                support@rufrent.com
              </a>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <FaWhatsapp className="text-green-500 text-lg" />
            <p className={`${tailwindStyles.heading_4} font-semibold`}>
              WhatsApp:
              <a
                href="https://wa.me/919985649278"
                target="_blank"
                className="text-blue-500 ml-1"
              >
                +91-9985649278
              </a>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <FaClock className="text-gray-700 text-lg" />
            <p className={`${tailwindStyles.heading_4} font-semibold`}>
              Support Hours:
              <span className="text-gray-600 ml-1">
                Mon–Sun: 9:00 AM – 7:00 PM
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
