import { useNavigate } from "react-router";
import classes from "./TermsOfService.module.css";
import { IoIosArrowRoundBack } from "react-icons/io";

export const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.page}>
      <h1
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "5%",
          left: "10%",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <IoIosArrowRoundBack />
        Back
      </h1>
      <section className={classes.content}>
        <h1>Terms of Service</h1>
        <p>
          Welcome to Alertly! These Terms of Service outline the rules and
          regulations for using our service.
        </p>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By using Alertly, you agree to comply with these terms. If you do not
          agree, please do not use our service.
        </p>
        <h2>2. Service Usage</h2>
        <p>
          Alertly provides curated news updates via WhatsApp. You must be at
          least 18 years old or have parental consent to use this service.
        </p>
        <h2>3. Subscription & Payments</h2>
        <p>
          Our service costs 200 Naira per month. Payments are processed through
          secure gateways, and subscriptions renew automatically unless
          canceled.
        </p>
        <h2>4. Cancellation</h2>
        <p>
          You can cancel your subscription anytime by sending "STOP" to our
          WhatsApp agent. For more details, visit our{" "}
          <a onClick={() => navigate("delete-account")}>Delete Account</a> page.
        </p>
        <h2>5. Changes to Terms</h2>
        <p>
          We may update these terms periodically. Continued use of Alertly after
          changes means you accept the new terms.
        </p>
        <p>
          For questions, contact us at <b>adetona67@gmail.com</b>.
        </p>
      </section>
    </div>
  );
};
