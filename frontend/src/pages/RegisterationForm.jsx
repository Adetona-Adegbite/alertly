import { useState, useRef } from "react";
import classes from "./RegisterationForm.module.css";

const RegisterationPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showOtp, setShowOtp] = useState(false);
  const [category, setCategory] = useState("");
  const refs = useRef([]);

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    if (e.target.value.length === 10) {
      setShowOtp(true);
      refs.current[0]?.focus();
    }
  };

  const handleOTPChange = (index, value) => {
    if (isNaN(value)) return;
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const categories = [
    "Technology",
    "Sports",
    "Politics",
    "Health",
    "Entertainment",
  ];

  return (
    <div className={classes.formContainer}>
      <h2>Register for News Alerts</h2>
      <label>Name:</label>
      <input
        type="text"
        placeholder="Enter your name"
        required
        className={classes.input}
      />
      <label>Email</label>
      <input
        type="tel"
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        maxLength={10}
        required
        className={classes.input}
      />

      <label>Whatsapp Phone Number:</label>
      <input
        type="tel"
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        maxLength={10}
        required
        className={classes.input}
      />

      {showOtp && (
        <div className={classes.otpContainer}>
          <label>Enter OTP:</label>
          <div className={classes.otpInputs}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (refs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={classes.otpBox}
              />
            ))}
          </div>
        </div>
      )}

      <label>Select News Category:</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={classes.select}
      >
        <option value="" disabled>
          Select a category
        </option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <button type="submit" className={classes.button}>
        Submit
      </button>
    </div>
  );
};

export default RegisterationPage;
