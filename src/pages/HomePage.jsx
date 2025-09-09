import Eyes from "../components/Eyes";
import { Link } from "react-router-dom";
import { Icons } from "../components/Icons";
import UseAuth from "../UseAuth";
import { useEffect, useState } from "react";

const Btn = ({ title, description, to }) => (
  <Link
    to={to}
    className=" bg-primary text-backgroundcolor hover:text-darkPrimary p-3 rounded-3xl w-9/12 hover:scale-105 hover:shadow-lg hover:bg-darkBackgroundcolor transition-all duration-300 ease-out cursor-pointer">
    <button className="text-start cursor-pointer">
      <h1 className="font-extrabold text-2xl">{title}</h1>
      <p className="text-sm">{description}</p>
    </button>
  </Link>
);

function HomePage() {
  const { isAuthenticated } = UseAuth();
  const [user, setUser] = useState();

  useEffect(() => {
    if (isAuthenticated) {
      setUser(JSON.parse(localStorage.getItem("user_data")));
    }
  }, [isAuthenticated]);

  return (
    <>
      <div className="w-screen h-screen bg-backgroundcolor overflow-hidden!">
        <div className="mx-2 mt-3 py-3 px-2 xs:px-4 flex justify-between items-center">
          {/* bg-darkBackgroundcolor rounded-xl */}
          <h2 className="text-center text-2xl font-bold">گیم کلاب</h2>
          <Link
            className="flex justify-center items-center gap-2 hover:scale-105 transition-all duration-300 ease-out"
            // bg-darkBackgroundcolor hover:bg-backgroundcolor
            to={"/login"}>
            <span className="text-lg">
              {user?.first_name
                ? user.first_name
                : user?.phone
                ? user.phone
                : "کاربر مهمان"}
            </span>
            <Icons.Profile className={"w-9 stroke-black"} />
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center w-full h-full">
          <Eyes />
          <div className="flex flex-col justify-center items-center gap-3 size-70 py-4 bg-darkPrimary animate-wiggle-body">
            <Btn
              title={"بازی آفلاین"}
              description={"بازی با دوستان بصورت محلی"}
              to="/OfflineGames"
            />
            <Btn
              title={"بازی آنلاین"}
              description={"بازی با دوستان بصورت جهانی"}
              to={isAuthenticated ? "/OnlineGames" : "/login"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
