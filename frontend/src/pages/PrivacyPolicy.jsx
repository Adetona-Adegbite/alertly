import { useNavigate } from "react-router";
import classes from "./PrivacyPolicy.module.css";
import { IoIosArrowRoundBack } from "react-icons/io";

export const PrivacyPolicy = () => {
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
        <h1>Privacy Policy</h1>
        <p>
          Your privacy is important to us. This Privacy Policy outlines how
          Alertly collects, uses, and protects your information.
        </p>
        <h2>1. Information We Collect</h2>
        <p>
          We collect minimal personal data necessary to provide our service,
          including your phone number and selected news categories.
        </p>
        <h2>2. How We Use Your Information</h2>
        <p>
          We use your information solely to deliver tailored news updates to
          your WhatsApp and improve our service.
        </p>
        <h2>3. Data Security</h2>
        <p>
          We implement strong security measures to keep your data safe and never
          share it with third parties.
        </p>
        <h2>4. Your Rights</h2>
        <p>
          You can request data deletion anytime by following the instructions on
          our <a onClick={() => navigate("/delete-account")}>Delete Account </a>
          page.
        </p>
        <p>
          For any concerns, contact us at <b>adetona67@gmail.com</b>.
        </p>
      </section>
    </div>
  );
};
