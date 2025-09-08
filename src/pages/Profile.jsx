import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../Path";
import { Icons } from "../components/Icons";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => ({
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    gender: user?.gender || "",
  }));
  const [loading, setLoading] = useState(false);

  // Fetch user data from API when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await axios.get(`${API_BASE}/users/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = response.data;
          setUser(data);
          console.log("User data fetched:", data); // For debugging
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user_data");
          navigate("/login", { replace: true });
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // وقتی وارد ویرایش می‌شویم یا user تغییر می‌کند، فرم را همگام کن
  useEffect(() => {
    if (editing && user) {
      setForm({
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        gender: user.gender || "",
      });
    }
  }, [editing, user]);

  const fieldCls =
    "bg-slowSubPrimary border-2 p-2 rounded-xl w-full outline-none transition-all duration-300";

  const displayOrDash = (val) =>
    val === null || val === undefined || val === "" ? "—" : String(val);

  // ذخیره با آپدیت خوش‌بینانه و فول‌بک در نبود پاسخ
  const saveProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("user_data");
      navigate("/login", { replace: true });
      return;
    }
    if (!form.email) {
      alert("ایمیل را وارد کنید");
      return;
    }

    // بدنه PATCH (رمز اگر خالی بود ارسال نشود)
    const payload = {
      email: form.email || "",
      phone: form.phone || "",
      password: form.password ? form.password : undefined,
      first_name: form.first_name || "",
      last_name: form.last_name || "",
      gender: form.gender || "",
    };
    const body = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined)
    );

    // 1) آپدیت خوش‌بینانه فوری
    const prevUser = user;
    const optimisticUser = { ...(user || {}), ...body };
    // هرگز password را در user_data نگه ندار
    delete optimisticUser.password;
    setUser((u) => ({ ...(u || {}), ...optimisticUser }));
    localStorage.setItem("user_data", JSON.stringify(optimisticUser));
    setEditing(false);

    setLoading(true);
    try {
      const res = await axios.patch(`${API_BASE}/users/me`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
      });

      // 2) تأیید با پاسخ سرور یا حفظ حالت خوش‌بینانه اگر بدنه خالی بود
      const serverData =
        res?.data && Object.keys(res.data || {}).length > 0 ? res.data : null;
      if (serverData) {
        const merged = { ...(optimisticUser || {}), ...serverData };
        delete merged.password;
        setUser(merged);
        localStorage.setItem("user_data", JSON.stringify(merged));
      }
      // اگر بدنه‌ای نبود، همین optimisticUser باقی می‌ماند
    } catch (err) {
      // 3) رول‌بک روی خطا
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_data");
        navigate("/login", { replace: true });
        return;
      }
      console.error("Update error:", err);
      alert("به‌روزرسانی ناموفق بود");
      // رول‌بک به مقدار قبلی
      setUser(prevUser || null);
      if (prevUser) {
        localStorage.setItem("user_data", JSON.stringify(prevUser));
      } else {
        localStorage.removeItem("user_data");
      }
      setEditing(true); // برگرد به ویرایش تا کاربر اصلاح کند
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user_data");
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div
      className="p-2 bg-backgroundcolor w-screen min-h-screen flex flex-col justify-between"
      dir="rtl">
      {/* Header */}
      <div className="py-3 px-2 xs:px-4 flex justify-between items-center mt-1 mb-5 bg-darkBackgroundcolor rounded-xl">
        <h2 className="text-center text-2xl font-bold">پروفایل کاربری</h2>
        <Link
          className="flex justify-center items-center border-2 rounded-3xl py-1 pl-2 pr-3 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out bg-darkBackgroundcolor hover:bg-backgroundcolor"
          to={"/"}>
          <span>برگشت</span>
          <Icons.arrow className={"w-6 rotate-180"} />
        </Link>
      </div>

      {/* Body */}
      <div className="flex flex-col justify-center items-center">
        <div className="bg-subPrimary flex flex-col justify-center items-center gap-4 p-5 rounded-2xl w-[min(100%,480px)]">
          {/* Header Row */}
          <div className="flex items-center gap-3 w-full">
            <div className="size-10 sm:size-12 rounded-full bg-slowSubPrimary flex items-center justify-center text-lg font-bold" />
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-backgroundcolor">
                اطلاعات کاربری
              </h1>
            </div>
            <div className="flex justify-center items-center gap-2">
              <button
                type="button"
                onClick={() => setEditing((s) => !s)}
                disabled={loading}
                className="border-2 p-1 sm:py-1 sm:px-3 rounded-2xl bg-primary cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:bg-darkPrimary hover:text-backgroundcolor disabled:opacity-60">
                {editing ? (
                  <Icons.close className="w-6 block sm:hidden" />
                ) : (
                  <Icons.edit className="w-6 block sm:hidden" />
                )}
                <span className="hidden sm:block">
                  {editing ? "انصراف" : "ویرایش اطلاعات"}
                </span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="border-2 rounded-3xl p-1 sm:py-1 sm:px-3 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out bg-primary hover:bg-darkPrimary hover:text-backgroundcolor disabled:opacity-60">
                <Icons.quit className="w-6 block sm:hidden" />
                <span className="hidden sm:block">خروج</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="w-full text-sm sm:text-base bg-slowSubPrimary p-4 rounded-2xl grid grid-cols-1 gap-3">
            {!editing ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">ایمیل</span>
                  <span>{displayOrDash(user?.email)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">شماره</span>
                  <span>{displayOrDash(user?.phone)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">نام</span>
                  <span>{displayOrDash(user?.first_name)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">نام‌خانوادگی</span>
                  <span>{displayOrDash(user?.last_name)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">جنسیت</span>
                  <span>{displayOrDash(user?.gender)}</span>
                </div>
              </>
            ) : (
              <>
                <label className="flex flex-col gap-1">
                  <span className="font-semibold">ایمیل</span>
                  <input
                    type="email"
                    className={fieldCls}
                    value={form.email}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, email: e.target.value }))
                    }
                    autoComplete="email"
                    placeholder="example@gmail.com"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="font-semibold">شماره</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    className={fieldCls}
                    value={form.phone}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, phone: e.target.value }))
                    }
                    placeholder="09XXXXXXXXX"
                    autoComplete="tel"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="font-semibold">رمز عبور (اختیاری)</span>
                  <input
                    type="password"
                    className={fieldCls}
                    value={form.password}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, password: e.target.value }))
                    }
                    placeholder="در صورت نیاز برای تغییر رمز"
                    autoComplete="new-password"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="font-semibold">نام</span>
                  <input
                    type="text"
                    className={fieldCls}
                    value={form.first_name}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, first_name: e.target.value }))
                    }
                    placeholder="نام"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="font-semibold">نام‌خانوادگی</span>
                  <input
                    type="text"
                    className={fieldCls}
                    value={form.last_name}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, last_name: e.target.value }))
                    }
                    placeholder="نام‌خانوادگی"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="font-semibold">جنسیت</span>
                  <select
                    className={fieldCls}
                    value={form.gender}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, gender: e.target.value }))
                    }>
                    <option value="">انتخاب کنید</option>
                    <option value="Male">آقا</option>
                    <option value="Female">خانم</option>
                  </select>
                </label>

                <div className="flex justify-center items-center w-full gap-2 pt-2">
                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={loading}
                    className="border-2 w-full font-bold py-2 px-4 bg-primary rounded-2xl cursor-pointer hover:scale-105 hover:bg-darkPrimary hover:text-backgroundcolor transition-all duration-300 ease-out disabled:opacity-60">
                    {loading ? "در حال ذخیره..." : "ذخیره"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div />
    </div>
  );
}
