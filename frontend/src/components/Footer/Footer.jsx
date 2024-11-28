import React from "react";
import './Footer.scss';
import BeCodeLogo from "../../assets/icons/BeCode_logo_BeCode_color.jpg";
import Twitter from "../../assets/icons/twitter-black-shape.png";
import Facebook from "../../assets/icons/facebook.png";
import LinkedIn from "../../assets/icons/linkedin.png";
import Instagram from "../../assets/icons/instagram.png";

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__left">
                <div className="footer__info">
                    <img className="footer__logo" src={ BeCodeLogo } alt="BeCode logo" />
                    <p className="footer__description">At BeCode, we make tech trainings accessible to all. We support, advise, train job seekers to become the tech talent of tomorrow and help companies to reskill / upskill their team or hire our talents.</p>
                </div>
                <div className="footer__socials">
                    <a href="https://x.com/becodeorg">
                        <img className="footer__social-icon" src={ Twitter } alt="twitter logo" />
                    </a>
                    <a href="https://www.facebook.com/becode.org/">
                        <img className="footer__social-icon" src={ Facebook } alt="facebook logo" />
                    </a>
                    <a href="https://www.linkedin.com/company/becode.org/">
                        <img className="footer__social-icon" src={ LinkedIn } alt="linkedin logo" />
                    </a>
                    <a href="https://www.instagram.com/becodeorg/">
                        <img className="footer__social-icon" src={ Instagram } alt="instagram logo" />
                    </a>
                </div>
            </div>
            <div className="footer__right">
                <div className="footer__links">
                    <div className="footer__link-section">
                        <a className="footer__link" href="/">Home</a>
                    </div>
                    <div className="footer__link-section">
                        <a className="footer__link" href="/">Profile</a>
                        <a className="footer__link" href="/">Meetings</a>
                        <a className="footer__link" href="/">Calendar</a>
                    </div>
                    <div className="footer__link-section">
                        <a className="footer__link" href="/">Moodle</a>
                    </div>
                    <div className="footer__link-section">
                        <a className="footer__link" href="/">BeCode</a>
                        <a className="footer__link" href="/">Campuses</a>
                        <a className="footer__link" href="/">Team</a>
                    </div>
                </div>
                <div className="footer__copyright">
                    <p>Copyright 2024. All rights reserved</p>
                </div>
            </div>
        </footer>
    )
};