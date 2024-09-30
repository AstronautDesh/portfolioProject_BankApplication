// Page/ContactPage.js
import React from "react";
import IconsComponent from "../Components/MenuList";
import contactIcons from "../Components/ContactIcons";
import "../css/contactpage.css";

function ContactPage({ isMenuOpen }) {
  console.log("im here too");

  return (
    <div className="contact">
      <div id="pitch-box">
        <div className="contact-pitch">
          We're Much More Closer Than You Think
        </div>
      </div>

      <div className="icon-grid">
        {contactIcons.map((item) => (
          <div
            key={item.id}
            id={item.id}
            className={item.className}
            data-contact={item.dataContact}
          >
            <item.Icon className="icon" />
          </div>
        ))}
      </div>
      <IconsComponent />
    </div>
  );
}

export default ContactPage;
