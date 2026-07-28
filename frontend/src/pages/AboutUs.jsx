import React from 'react'
import '../pageStyles/AboutUs.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AboutUs() {
  return (
    <>
    <PageTitle title='About Us'/>
    <Navbar/>
    <div className="about-container">
        <h1 className='about-h1'>About Us</h1>
        <div className="about-container1">
            <p>At Our Ecommerce Website, we’re more than just an online store — we’re your trusted partner in making shopping faster, easier, and more enjoyable. Since our beginning, our mission has been simple: to bring quality products at unbeatable prices to your doorstep with just a few clicks.We understand that shopping isn’t just about buying things — it’s about convenience, trust, and experience. That’s why we’ve built a platform where you can discover everything you need, from the latest fashion trends, electronics, and home essentials to beauty, fitness, and lifestyle products.What sets us apart is our commitment to customers. We carefully curate our collections, ensuring that every product meets high standards of quality, durability, and affordability. Our secure payment gateways, fast delivery network, and hassle-free returns make shopping with us completely stress-free.</p>
        </div>
        <div className="about-container2">
          <img src="./images/Shop1.jpg" style={{width:'350px',height:'350px'}} alt="" />
          <div className="about-container-3">
            <h2>Delight is our business. Together, we can make it yours.</h2>
            <p>Our platform strengthens customer relationships and fosters employee happiness. We focus on creating seamless interactions and enhancing satisfaction at every touchpoint, driven by the belief that happy teams create loyal, satisfied customers.</p>
          </div>
        </div>
        <div className="about-container-4">
          <div className="about-container-5">
            <h2>What we value at work</h2>
            <div className="about-container-6">
              <h5>Happy Environment</h5>
              <p>A happy environment fuels positivity, innovation, and teamwork. When employees feel supported and valued, their productivity and satisfaction soar. In turn, this leads to stronger results and a thriving company culture.</p>
            </div>
            <div className="about-values-list">
  <p>Agility with accountability</p>
  <p>True friend of the customer</p>
  <p>Be a lifelong learner</p>
</div>
          </div>
          <img src="./images/shop2.jpg" style={{width:'350px',height:'350px'}} alt="" />
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default AboutUs