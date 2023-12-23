import Link from "next/link";
import React from "react";
import Image from "next/image";
import { FaPhone, FaMapMarker, FaEnvelope, FaFacebook } from "react-icons/fa"; // Import the Font Awesome icons

const AboutContacts = () => {
  // Definition for City Health Office
  const cityHealthOfficeDefinition =
    "The Dasmariñas City Health Office is a government agency responsible for promoting and protecting the health of the residents of Dasmariñas, Cavite. It plays a vital role in ensuring the delivery of quality healthcare services, disease prevention, health education, and access to essential medical resources within the city.";

  const linkStyle =
    "flex gap-2 justify-center items-center text-white hover:text-secondary duration-150 text-lg"; // Add text-lg for larger font size
  return (
    <section
      className="min-h-screen flex flex-col justify-center items-center py-12 bg-primary bg-opacity-100 text-white md:px-[90px] sm:px-[60px] px-[20px]"
      id="About"
    >
      <div className="h-full w-full bg-[#11111171]" />
      <div className="mb-4 border-b-4 border-secondary">
        <h2 className="text-white text-center">About and Contacts</h2>
      </div>
      <div>
        <Image src={"/dasmariñasLogo.png"} alt={`City Logo`} height={50} width={50}/>
      </div>
      <div className="pt-12 ">
        <p className="text-[18px]">{cityHealthOfficeDefinition}</p>
        <div className="py-12">
          <hr></hr>
        </div>
        <ul className="py-4 gap-8 lg:gap-12 flex flex-col lg:flex-row justify-center items-start lg:items-center">
          <li>
            <Link prefetch  href="#" target="_blank" className={linkStyle}>
              <FaEnvelope size={25} /> cityhealthoffice@gmail.com
            </Link>
          </li>
          <li>
            <Link prefetch  href="#" className={`flex gap-2 justify-center items-center text-white hover:text-secondary duration-150 text-lg`}>
              <FaPhone size={25} /> Phone: +63-992-534-4332
            </Link>
          </li>
          <li>
            <Link prefetch 
              href="https://www.facebook.com/profile.php?id=100090386325916"
              target="_blank"
              className={linkStyle}
            >
              <FaFacebook size={25} /> City Health Office 1
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default AboutContacts;
