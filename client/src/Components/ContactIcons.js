// Components/ContactIcons.js
//import React from 'react';
import {
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
} from "react-icons/fa";

const contactIcons = [
  {
    id: 'item-1',
    className: 'icon-container phone',
    dataContact: 'Call us: 123-456-7890',
    Icon: FaPhone,
  },
  {
    id: 'item-2',
    className: 'icon-container email',
    dataContact: 'Email: example@email.com',
    Icon: FaEnvelope,
  },
  {
    id: 'item-3',
    className: 'icon-container whatsapp',
    dataContact: 'WhatsApp: +1 234-567-8901',
    Icon: FaWhatsapp,
  },
  {
    id: 'item-4',
    className: 'icon-container facebook',
    dataContact: 'Facebook: /yourpage',
    Icon: FaFacebookF,
  },
  {
    id: 'item-5',
    className: 'icon-container twitter',
    dataContact: 'Twitter: @yourhandle',
    Icon: FaTwitter,
  },
];

export default contactIcons;
