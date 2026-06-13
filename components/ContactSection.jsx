"use client";

import { useEffect } from "react";
import ContactForm from "@/components/ContactForm";
import { whenLucideReady } from "@/lib/legacyRuntime";
import "./contactSection.css";

export default function ContactSection() {
  useEffect(() => {
    return whenLucideReady(() => {});
  }, []);

  return (
    <section id="contact-section" className="contact-section" data-contact-section>
      <div className="contact-section__container">
        <div className="contact-section__grid">
          <div className="contact-section__left">
            <div className="contact-section__intro">
              <div className="contact-section__badge">
                <i data-lucide="send" className="contact-section__badge-icon" />
                <span className="contact-section__eyebrow">Get In Touch</span>
              </div>
              <h2 className="contact-section__headline">
                Let&apos;s Build Something <br />
                <span className="contact-section__gradient-text">Legendary.</span>
              </h2>
              <p className="contact-section__lead">
                Ready to move beyond ordinary marketing? Submit the form and our strategists will
                connect with you within 24 hours to map your growth plan.
              </p>
            </div>

            <div className="contact-section__cards">
              <div className="contact-section__card contact-section__card--email">
                <div className="contact-section__card-inner">
                  <div className="contact-section__icon contact-section__icon--blue">
                    <i data-lucide="mail" />
                  </div>
                  <div className="contact-section__card-body">
                    <h3 className="contact-section__card-title">Email Us</h3>
                    <a
                      href="mailto:affiliate@webaffino.com"
                      className="contact-section__email-link"
                      aria-label="Email Web Affino"
                    >
                      affiliate@webaffino.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-section__card contact-section__card--visit">
                <div className="contact-section__card-inner">
                  <div className="contact-section__icon contact-section__icon--purple">
                    <i data-lucide="map-pin" />
                  </div>
                  <div className="contact-section__card-body">
                    <h3 className="contact-section__card-title">Visit Us</h3>
                    <address className="contact-section__address">
                      89225, 111 NE 1st St, 8th Floor
                      <br />
                      Miami, FL 33132
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-section__form-column">
            <div className="contact-section__form-glow" aria-hidden="true" />
            <div className="contact-section__form-card">
              <div className="contact-section__form-header">
                <h3 className="contact-section__form-title">Send a Message</h3>
                <p className="contact-section__form-subtitle">
                  Fill out the form below to get started.
                </p>
              </div>
              <div className="contact-section__embed-host">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
