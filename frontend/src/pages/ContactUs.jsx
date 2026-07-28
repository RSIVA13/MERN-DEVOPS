import React, { useRef } from "react";
import emailjs from "emailjs-com";
import '../pageStyles/ContactUs.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Email, LocationCity, LocationOffRounded, Phone } from '@mui/icons-material';

function ContactUs() {
    const formRef = useRef();
    const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_ccfduvl",     // Replace with your EmailJS service ID
        "template_pesgw1s",    // Replace with your EmailJS template ID
        formRef.current,
        "fmmkv6xUc88Y6iGBv"         // Replace with your EmailJS public key
      )
      .then(
        (result) => {
          alert("Message sent successfully!");
          // console.log(result.text);
        },
        (error) => {
          alert("Failed to send message. Try again!");
          // console.log(error.text);
        }
      );
  };
  return (
    <>
    <PageTitle title='Contact-Us'/>
    <Navbar/>
    <div className="contact-container">
        <div className="contact-container1">
            <h1>Don’t hesitate to reach out with any inquiries</h1>
            <p>We're here to provide the information and support you need. Don’t hesitate to reach out with any inquiries—our team is ready to assist you. Let’s connect and explore how we can work together.</p>
            <p><LocationCity style={{fontSize:'48px',color:'green'}}/><b>Our Location : Chennai</b></p>
            <p><Email style={{fontSize:'48px',color:'red'}}/><b>Email : sivacore13@gmail.com</b></p>
            <p><Phone style={{fontSize:'48px',color:'blue'}}/><b>phone : +91-9003990989</b></p>
        </div>
        <div className='contact-container2'>
            <h2>Send Us Message</h2>
            <form ref={formRef} className='contact-form' onSubmit={sendEmail}>
                <input type="text" id='name' name='name' placeholder='Name'  required/>
                <input type="email" id='email' name='email' placeholder='Email'  required/>
                <input type="number" id='phone' name='phone' placeholder='Phone No'  />
                <input type="text" placeholder='City' id='city' name='city'  />
                <select name="queryType" required>
                    <option value="">Type Of Query</option>
                    <option value="location">Location Not Came</option>
                    <option value="product">product Not Found</option>
                    <option value="stock">Stock Not Available</option>
                </select>
                <textarea id='query' name='query' required placeholder='Enter Your Query'></textarea>
                <button type="submit" className='send-btn'>Send</button>
            </form>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default ContactUs