import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icons } from "../components/Icons";
import { API_BASE } from "../Path";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UseAuth from "../UseAuth";

export default function Login() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();
  const { isAuthenticated } = UseAuth();

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [nameError, setNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [codeError, setCodeError] = useState(false);

  const [textError, setTextError] = useState(null);

  // Signup form state
  const [signPhone, setSignPhone] = useState("");
  const [signPassword, setSignPassword] = useState("");
  const [signCode, setSignCode] = useState("");

  // SMS code resend timer
  const [resendTimer, setResendTimer] = useState(0);
  const [isSendingCode, setIsSendingCode] = useState(false);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const handleSendCode = async () => {
    if (!signPhone || resendTimer > 0) return;
    try {
      if (signPhone == "") {
        setTextError("شماره نمی‌تواند خالی باشد.");
        setNameError(true);
        return;
      }
      if (signPassword == "") {
        setPasswordError(true);
        setTextError("پسورد نمی‌تواند خالی باشد.");
        return;
      }
      sendCode();
      setIsSendingCode(true);
      setResendTimer(60);
    } finally {
      setIsSendingCode(false);
    }
  };

  function clearErrors() {
    setTextError("");
    setNameError(false);
    setPasswordError(false);
    setCodeError(false);
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile", { replace: true });
    }
  }, [isAuthenticated]);

  // async function checkLogin() {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       return;
  //     }
  //     const response = await axios.get(`${API_BASE}/users/me`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `bearer ${token}`,
  //       },
  //     });
  //     if (response.status === 200) {
  //       const data = await response.data;
  //       localStorage.setItem("user_data", JSON.stringify(data));
  //       navigate("/profile", { replace: true });
  //     }
  //   } catch (error) {
  //     console.error("Sign error:", error);
  //     // مدیریت خطاها می‌تونه در اینجا باشه
  //   }
  // }

  async function handleLoginSubmit(e) {
    e.preventDefault();

    clearErrors();

    try {
      if (loginUsername == "") {
        setTextError("شماره نمی‌تواند خالی باشد.");
        setNameError(true);
        return;
      }
      if (loginPassword == "") {
        setPasswordError(true);
        setTextError("پسورد نمی‌تواند خالی باشد.");
        return;
      }

      const params = new URLSearchParams();
      params.append("username", loginUsername);
      params.append("password", loginPassword);

      const response = await axios.post(`${API_BASE}/auth/token`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.access_token);
        navigate("/profile", { replace: true });
      }
    } catch (error) {
      setTextError(error?.response?.data?.detail);
      console.error("Login error:", error);
      // مدیریت خطاها می‌تونه در اینجا باشه
    }
  }
  async function sendCode() {
    clearErrors();

    try {
      const data = {
        phone: signPhone,
        password: signPassword,
      };

      const response = await axios.post(
        `${API_BASE}/users`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json", // Content-Type باید application/json باشد
          },
        }
      );

      if (response.status === 200) {
        console.log("done");
        // در اینجا می‌توانید اقدامات بعدی رو انجام بدید
      }
    } catch (error) {
      console.error("Sign error:", error);
      // مدیریت خطاها می‌تونه در اینجا باشه
    }
  }
  async function handleSignupSubmit(e) {
    e.preventDefault();

    clearErrors();
    try {
      if (signPhone == "") {
        setTextError("شماره نمی‌تواند خالی باشد.");
        setNameError(true);
        return;
      }
      if (signPassword == "") {
        setPasswordError(true);
        setTextError("پسورد نمی‌تواند خالی باشد.");
        return;
      }
      if (signCode == "") {
        setTextError("کد را وارد کنید.");
        setCodeError(true);
        return;
      }
      const data = {
        phone: signPhone,
        code: signCode,
      };
      const response = await axios.post(
        `${API_BASE}/users/activate`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        // localStorage.setItem("token", response.data.access_token);
        navigate("/", { replace: true });
      }
    } catch (error) {
      setTextError(error?.response?.data?.detail);
      console.error("Sign error:", error);
      // مدیریت خطاها می‌تونه در اینجا باشه
    }
  }

  const tabBtnBase =
    "flex-1 py-2 rounded-xl text-center transition-all duration-300 ease-out";
  const tabBtnActive = "bg-primary text-backgroundcolor shadow hover:scale-105";
  const tabBtnInactive = "bg-transparent hover:bg-backgroundcolor/30";

  return (
    <div
      className="p-2 bg-backgroundcolor w-screen min-h-screen flex flex-col justify-between"
      dir="rtl">
      <div className="py-3 px-2 xs:px-4 flex justify-between items-center mt-1 mb-5 bg-darkBackgroundcolor rounded-xl">
        <h2 className="text-center text-2xl font-bold">
          {mode === "login" ? "صفحه ورود" : "صفحه ثبت‌نام"}
        </h2>
        <Link
          className="flex justify-center items-center border-2 rounded-3xl py-1 pl-2 pr-3 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out bg-darkBackgroundcolor hover:bg-backgroundcolor"
          to={"/"}>
          <span>برگشت</span>
          <Icons.arrow className={"w-6 rotate-180"} />
        </Link>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="bg-subPrimary flex flex-col justify-center items-center gap-4 p-5 rounded-2xl w-[min(100%,480px)]">
          {/* Tabs */}
          <div className="bg-slowSubPrimary p-1 rounded-2xl w-full flex">
            <button
              type="button"
              className={`${tabBtnBase} ${
                mode === "login" ? tabBtnActive : tabBtnInactive
              }`}
              onClick={() => {
                setMode("login");
                clearErrors();
              }}>
              ورود
            </button>
            <button
              type="button"
              className={`${tabBtnBase} ${
                mode === "signup" ? tabBtnActive : tabBtnInactive
              }`}
              onClick={() => {
                setMode("signup");
                clearErrors();
              }}>
              ثبت‌نام
            </button>
          </div>

          {mode === "login" ? (
            // Login form
            <form
              onSubmit={handleLoginSubmit}
              className="flex flex-col gap-3 w-full">
              <h1 className="text-2xl font-bold pb-1 text-backgroundcolor text-center">
                ورود
              </h1>

              <input
                type="text"
                placeholder="شماره موبایل (مثال: 09XXXXXXXXX)"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className={`bg-slowSubPrimary p-2 rounded-xl w-full outline-none transition-all duration-300 ${
                  nameError &&
                  "border-darkPrimary placeholder:text-darkPrimary border-2"
                }`}
                autoComplete="username"
              />

              <input
                type="password"
                placeholder="رمز عبور"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={`bg-slowSubPrimary p-2 rounded-xl w-full outline-none transition-all duration-300 ${
                  passwordError &&
                  "border-darkPrimary placeholder:text-darkPrimary border-2"
                }`}
                autoComplete="current-password"
              />

              <button
                type="submit"
                className="border-2 font-bold py-2 text-lg bg-primary w-full rounded-2xl cursor-pointer hover:scale-105 hover:bg-darkPrimary hover:text-backgroundcolor transition-all duration-300 ease-out">
                ورود
              </button>
            </form>
          ) : (
            // Signup form
            <form
              onSubmit={handleSignupSubmit}
              className="flex flex-col gap-3 w-full">
              <h1 className="text-2xl font-bold pb-1 text-backgroundcolor text-center">
                ثبت‌نام
              </h1>

              <input
                type="tel"
                inputMode="numeric"
                placeholder="شماره موبایل (مثال: 09XXXXXXXXX)"
                value={signPhone}
                onChange={(e) => setSignPhone(e.target.value)}
                className={`bg-slowSubPrimary p-2 rounded-xl w-full outline-none ${
                  nameError &&
                  "border-darkPrimary placeholder:text-darkPrimary border-2"
                }`}
                autoComplete="tel"
              />

              <input
                type="password"
                placeholder="رمز عبور"
                value={signPassword}
                onChange={(e) => setSignPassword(e.target.value)}
                className={`bg-slowSubPrimary p-2 rounded-xl w-full outline-none ${
                  passwordError &&
                  "border-darkPrimary placeholder:text-darkPrimary border-2"
                }`}
                autoComplete="new-password"
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="کد تایید"
                  value={signCode}
                  onChange={(e) => setSignCode(e.target.value)}
                  className={`bg-slowSubPrimary p-2 rounded-xl w-full outline-none ${
                    codeError &&
                    "border-darkPrimary placeholder:text-darkPrimary border-2"
                  }`}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isSendingCode || resendTimer > 0 || !signPhone}
                  className={`border-2 px-3 rounded-xl bg-primary cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:bg-darkPrimary hover:text-backgroundcolor disabled:opacity-60 disabled:cursor-not-allowed`}
                  title={!signPhone ? "ابتدا شماره را وارد کنید" : ""}>
                  {resendTimer > 0
                    ? `ارسال مجدد ${resendTimer}s`
                    : isSendingCode
                    ? "در حال ارسال..."
                    : "ارسال کد"}
                </button>
              </div>

              <button
                type="submit"
                className="border-2 font-bold py-2 text-lg bg-primary w-full rounded-2xl cursor-pointer hover:scale-105 hover:bg-darkPrimary hover:text-backgroundcolor transition-all duration-300 ease-out">
                ثبت‌نام
              </button>
            </form>
          )}
          <p className="text-black">{textError}</p>
        </div>
      </div>

      <div />
    </div>
  );
}
