import Eyes from "../components/Eyes";
import { Link } from "react-router-dom";
import { Icons } from "../components/Icons";

const Btn = ({ title, description, to }) => (
  <Link
    to={to}
    className=" bg-primary text-backgroundcolor p-3 rounded-3xl w-9/12 hover:scale-105 hover:shadow-lg hover:bg-darkPrimary transition-all duration-300 ease-out cursor-pointer">
    <button className="text-start cursor-pointer">
      <h1 className="font-extrabold text-2xl">{title}</h1>
      <p className="text-sm">{description}</p>
    </button>
  </Link>
);

function HomePage() {
  return (
    <>
      <div className="w-screen h-screen bg-backgroundcolor overflow-hidden!">
        <div className="mx-2 mt-3 py-3 px-2 xs:px-4 flex justify-between items-center">
          {/* bg-darkBackgroundcolor rounded-xl */}
          <h2 className="text-center text-2xl font-bold">گیم کلاب</h2>
          <Link
            className="flex justify-center items-center gap-2 hover:scale-105 transition-all duration-300 ease-out"
            // bg-darkBackgroundcolor hover:bg-backgroundcolor
            to={"/"}>
            <span className="text-lg">نام کاربر</span>
            <Icons.Profile className={"w-9 stroke-black"} />
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="flex flex-col justify-center items-center gap-3 w-70 py-4 bg-darkBackgroundcolor animate-wiggle-body">
            <div className="pb-3">
              <Eyes />
            </div>
            <Btn
              title={"بازی آفلاین"}
              description={"بازی با دوستان بصورت محلی"}
              to="/OfflineGames"
            />
            <Btn
              title={"بازی آنلاین"}
              description={"بازی با دوستان بصورت جهانی"}
              to="/OfflineGames"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
