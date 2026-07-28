import React from 'react';
import "../componentStyles/Footer.css";
import {Phone,Mail, YouTube,Instagram,LinkedIn,GitHub} from '@mui/icons-material'

const Footer = () => {
  return (
    <footer className='footer'> 
     <div className="footer-container">
        {/* section1*/ }
        <div className="footer-section contact">
            <h3>Contact Us</h3>
            <p><Phone fontSize='small'/>Phone : +91-9003990100</p>
            <p><Mail fontSize='small'/>Email : sivacore13@gmail.com</p>
        </div>
        {/*section2 */}
        <div className="footer-section social">
            <h3>Follow Me</h3>
            <div className='social-links'>
                <a href="" target='_blank'><GitHub className="social-icon"/></a>
                <a href="" target='_blank'><LinkedIn className="social-icon"/></a>
                <a href="" target='_blank'><YouTube className="social-icon"/></a>
                <a href="" target='_blank'><Instagram className="social-icon"/></a>
            </div>
        </div>
        {/*section3 */}
        <div className='footer-section about'>
              <h3>About</h3>
              <p>Providing web Development tutorials and Courses to help you grow your skills.</p>
        </div>
     </div>
     <div className="footer-bottom">
        <p>&copy; 2025 SivaCoding . All rights reserved</p>
     </div>
    </footer>
  )
}

export default Footer