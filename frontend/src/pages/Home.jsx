import classes from "./Home.module.css";
import aws from "../assets/aws.png";
import paystack from "../assets/paystack.256x252.png";
import whatsapp from "../assets/whatsapp.png";
import news from "../assets/n.png";
const HomePage = () => {
  return (
    <div className={classes.page}>
      <section className={classes.hero}>
        <nav>
          <ul>
            <li className={classes.logo}>
              <a href="">Alertly</a>
            </li>
            <ul className={classes.menuItems}>
              <li>
                <a href="">Home</a>
              </li>
              <li>
                <a href="">Our Platform</a>
              </li>
              <li>
                <a href="">Features</a>
              </li>
              <li>
                <a href="">FAQ</a>
              </li>
              <li>
                <a href="">Support</a>
              </li>
            </ul>
            <button>Register</button>
          </ul>
        </nav>
        <section className={classes.headline}>
          <h1>
            Tailored News <br /> <span>At your fingertips</span>
          </h1>
          <p>
            Stay ahead with Alertly – the smart AI agent that delivers curated
            news straight to your WhatsApp. With news tailored to your interests
            and delivered daily, all for just <b>200 Naira per month</b>, you’re
            set to never miss a beat.
          </p>
          <div className={classes.buttons}>
            <button className={classes.button1}>Get Started Now</button>
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
    </div>
  );
};
export default HomePage;
