// HomePage.js
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../css/homepage.css';
import { staggerChildren, fadeInAnimation } from '../Components/animationUtils';

function HomePage({ isMenuOpen }) {
  if (!isMenuOpen) return null; // removed unnecessary conditional rendering

  return (
    <AnimatePresence>
      <div className="home">
        <motion.div className="menu-list" variants={staggerChildren}>
          {menuItems.map((item, index) => (
            <motion.h2 key={index} variants={fadeInAnimation}>
              <Link to={item.link} className="menu-link">
                {item.label}
              </Link>
            </motion.h2>
          ))}
        </motion.div>
        <motion.div className="location" variants={fadeInAnimation}>
          {locations.map((location, index) => (
            <div key={index} className="cards">
              <div className="header">{location.header}</div>
              <div className="address">{location.address}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const menuItems = [
  { link: '/about', label: 'About Us' },
  { link: '/account', label: 'Account' },
  { link: '/contact', label: 'Contact Us' },
  { link: '/career', label: 'Career' },
];

const locations = [
  { header: 'Lagos', address: '117, Broad Street Lagos Island, Nigeria' },
  { header: 'Ibadan', address: 'Plot 7A, Queen Cinema Dugbe - Ibadan, Nigeria' },
  { header: 'Ondo', address: '230, Obafemi  Awolowo Way - Alagbaka , Akure - Ondo, Nigeria' },
  { header: 'Oshogbo', address: '23, New Ikirun Road, Aiyetoro - Osun, Nigeria' },
  { header: 'Ibafo', address: ' 410, Redeemers Crescent , Ogun, Nigeria' },
  { header: 'Eleyele', address: ' Plot 5A, Eleyele Interchange, Ibadan, Nigeria' },
  { header: 'Isale Eko', address: ' 30B, Idumota Market, Lagos, Nigeria' },
  { header: 'Ojuwoye Provisions Market', address: ' 142, New Mushin Road, Lagos, Nigeria' },
];

export default HomePage;