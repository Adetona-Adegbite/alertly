import { IoIosArrowRoundBack } from "react-icons/io";
import classes from "./DeleteAccount.module.css";
import { useNavigate } from "react-router";

export const DeleteAccount = () => {
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
        <h1>Delete Your Alertly Account</h1>
        <p>If you wish to delete your Alertly account, follow these steps:</p>
        <ol>
          <li>Open WhatsApp and go to our chat.</li>
          <li>
            Send <b>STOP</b> to our WhatsApp agent.
          </li>
          <li>You will receive a confirmation message.</li>
          <li>
            Reply with <b>YES</b> to confirm account deletion.
          </li>
          <li>
            Your data will be permanently removed, and you will no longer
            receive updates.
          </li>
        </ol>
        <p>
          If you face any issues, contact us at <b>hello@alertly.ng</b>.
        </p>
      </section>
    </div>
  );
};
