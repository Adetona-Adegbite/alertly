import classes from "./Home.module.css";
import aws from "../assets/aws.png";
import paystack from "../assets/paystack.256x252.png";
import whatsapp from "../assets/whatsapp.png";
import news from "../assets/n.png";
import illustration from "../assets/Chat bot-bro-3.png";
import reliableIcon from "../assets/checked.png";
import aiSummaryIcon from "../assets/robot.png";
import personalizedIcon from "../assets/bullseye.png";
import whatsappIcon from "../assets/messenger.png";
import { useState } from "react";
import { useNavigate } from "react-router";
const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();
  const faqs = [
    {
      question: "How much does it cost?",
      answer:
        "Alertly costs only 200 Naira per month. You'll get unlimited access to curated news updates and AI summaries.",
    },
    {
      question: "How often will I receive news?",
      answer:
        "You'll get updates 3 times daily - morning, afternoon, and evening. Breaking news alerts are sent immediately.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        'Simply send "STOP" to our WhatsApp agent at any time. Cancellation takes effect immediately.',
    },
    {
      question: "How reliable is the news?",
      answer:
        "We source news only from verified outlets like BBC and CNN. Our AI cross-checks facts across multiple reliable sources.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <div className={classes.page}>
      <section className={classes.hero}>
        <nav>
          <ul>
            <li className={classes.logo}>
              <a href="#">Alertly</a>
            </li>
            <ul className={classes.menuItems}>
              <li>
                <a href="#">Home</a>
              </li>

              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <a
                  onClick={() => {
                    navigate("privacy-policy");
                  }}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="mailto:adetona67@gmail.com">Support</a>
              </li>
            </ul>
            <button
              onClick={() => {
                navigate("register");
              }}
            >
              Register
            </button>
          </ul>
        </nav>
        <section id="headline" className={classes.headline}>
          <h1>
            Tailored News <br /> <span>At your fingertips</span>
          </h1>
          <p>
            Stay ahead with Alertly – the smart AI agent that delivers curated
            news straight to your WhatsApp. With news tailored to your interests
            and delivered daily, all for just <b>300 Naira per month</b>, you’re
            set to never miss a beat.
          </p>
          <div className={classes.buttons}>
            <button
              onClick={() => {
                navigate("register");
              }}
              className={classes.button1}
            >
              Get Started Now
            </button>
            <button className={classes.button2}>Contact Us</button>
          </div>
        </section>
        <section className={classes.technologies}>
          <h1>Backed by Leading News Outlets & Secure Technology</h1>
          <div>
            <img src={whatsapp} alt="Guardian" />
            <img src={paystack} alt="BBC" />
            <img src={news} alt="CNN" />
            <img src={aws} alt="TechCrunch" />
          </div>
        </section>
      </section>
      <section id="features" className={classes.hero2}>
        <h1>
          Your AI-Powered <br />
          <span>Personal News Agent</span>
        </h1>
        <p>
          Stay informed with tailored news updates delivered straight to your
          WhatsApp. Choose your interests and let Alertly handle the rest.
        </p>
        <div className={classes.featureContainer}>
          <img
            className={classes.illustration}
            src={illustration}
            alt="AI News Agent"
          />
          <div className={classes.featureList}>
            <div className={classes.featureItem}>
              <img src={aiSummaryIcon} alt="AI Summary" />
              <h3 className={classes.featureTitle}>AI-Powered Summaries</h3>
              <p className={classes.featureText}>
                Get 3-sentence briefs of complex news stories - understand
                headlines in seconds, not hours.
              </p>
            </div>

            <div className={classes.featureItem}>
              <img src={reliableIcon} alt="Reliable" />
              <h3 className={classes.featureTitle}>Trusted Reliability</h3>
              <p className={classes.featureText}>
                News verified by AI across 50+ credible sources - no rumors,
                just facts.
              </p>
            </div>

            <div className={classes.featureItem}>
              <img src={personalizedIcon} alt="Personalized" />
              <h3 className={classes.featureTitle}>Made for You</h3>
              <p className={classes.featureText}>
                Follow sports, tech, or custom keywords - your news feed adapts
                to your interests.
              </p>
            </div>

            <div className={classes.featureItem}>
              <img src={whatsappIcon} alt="WhatsApp Integration" />
              <h3 className={classes.featureTitle}>In Your WhatsApp</h3>
              <p className={classes.featureText}>
                News arrives like personal messages - read, reply, or share
                instantly with friends.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="faq" className={classes.faqSection}>
        <h1>Frequently Asked Questions</h1>
        <div className={classes.faqList}>
          {faqs.map((faq, index) => (
            <div
              className={`${classes.faqItem} ${
                activeIndex === index ? classes.active : ""
              }`}
              key={index}
            >
              <button
                className={classes.faqQuestion}
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                {faq.question}
                <span className={classes.indicator}></span>
              </button>
              <div
                id={`faq-answer-${index}`}
                className={classes.faqAnswer}
                style={{
                  maxHeight: activeIndex === index ? "500px" : "0",
                  opacity: activeIndex === index ? 1 : 0,
                }}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <footer className={classes.footer}>
        <div className={classes.footerContent}>
          <div className={classes.footerColumn}>
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#headline">About</a>
              </li>
              <li>
                <a href="#features">Features</a>
              </li>
            </ul>
          </div>

          <div className={classes.footerColumn}>
            <h4>Legal</h4>
            <ul>
              <li>
                <a onClick={() => navigate("privacy-policy")}>Privacy Policy</a>
              </li>
              <li>
                <a onClick={() => navigate("delete-account")}>Delete Account</a>
              </li>
              <li>
                <a onClick={() => navigate("terms-of-service")}>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div className={classes.footerColumn}>
            <h4>Contact</h4>
            <ul>
              <li>adetona67@gmail.com</li>
              <li>+234 901 701 0040</li>
              <div className={classes.socialLinks}>
                <a href="#">{/* <TwitterIcon /> */}</a>
                <a href="#">{/* <FacebookIcon /> */}</a>
                <a href="#">{/* <InstagramIcon /> */}</a>
              </div>
            </ul>
          </div>
        </div>

        <div className={classes.footerBottom}>
          <p>© 2025 Alertly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
export default HomePage;
