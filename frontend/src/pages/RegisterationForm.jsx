import { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import classes from "./RegisterationForm.module.css";

const RegisterationPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("234"); // Default Nigeria
  const [category, setCategory] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const refs = useRef([]);

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/, "");
    setPhoneNumber(value);
  };

  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) clearInterval(interval);
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtp = async () => {
    if (phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (timer > 0) {
      toast.warn("You have to wait a minute to request another otp");
      return;
    }
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    setLoading(true);

    try {
      const response = await fetch("http://44.243.115.34:3000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: "+" + fullPhoneNumber }),
      });

      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        toast.success("OTP sent successfully!");
        startTimer();
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error! Try again.");
    }

    setLoading(false);
  };

  const verifyOtp = async () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://44.243.115.34:3000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber, code: otpCode }),
      });

      const data = await response.json();
      if (data.success) {
        setOtpVerified(true);
        toast.success("OTP verified!");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Server error! Try again.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    console.log("Hi");
    e.preventDefault();
    if (!otpVerified) {
      toast.error("Please verify your OTP first!");
      return;
    }

    const formattedPhoneNumber = `${countryCode}${phoneNumber}`;
    setLoading(true);

    const payload = {
      name,
      email,
      phoneNumber: formattedPhoneNumber,
      category,
    };

    try {
      const response = await fetch(
        "http://44.243.115.34:3000/api/paystack/initialize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log(data.authorization_url);
      window.location.href = data.authorization_url;
    } catch (error) {
      toast.error("Server error! Try again.");
    }

    setLoading(false);
  };

  return (
    <div className={classes.page}>
      <ToastContainer />

      <div className={classes.formContainer}>
        <h2>Register for News Alerts</h2>
        <form>
          <label>Name:</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={classes.input}
          />

          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={classes.input}
          />

          <label>Phone Number:</label>
          <div className={classes.phoneContainer}>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className={classes.select}
            >
              <option value="1">🇺🇸 United States (+1)</option>
              <option value="234">🇳🇬 Nigeria (+234)</option>
              <option value="44">🇬🇧 UK (+44)</option>
              <option value="91">🇮🇳 India (+91)</option>
            </select>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              maxLength={10}
              required
              className={classes.input}
            />
          </div>

          <button
            type="button"
            onClick={sendOtp}
            disabled={timer > 0}
            className={classes.button}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Send OTP"}
          </button>

          {otpSent && (
            <>
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
                      onChange={(e) => {
                        let newOtp = [...otp];
                        newOtp[index] = e.target.value;
                        setOtp(newOtp);
                      }}
                      className={classes.otpBox}
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={verifyOtp}
                className={classes.button}
              >
                Verify OTP
              </button>
            </>
          )}

          <label>Select News Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={classes.select}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="business">Business</option>
            <option value="entertainment">Entertainment</option>
            <option value="general">General</option>
            <option value="science">Science</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
          </select>

          <button
            type="submit"
            className={
              !otpVerified || loading ? classes.disabled : classes.button
            }
            // disabled={!otpVerified || loading}
            onClick={handleSubmit}
          >
            {loading ? "Loading..." : "Subcribe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterationPage;
