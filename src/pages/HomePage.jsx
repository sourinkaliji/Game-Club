import Eyes from "../components/Eyes";
import { Link } from "react-router-dom";

const Btn = ({ title, description, to }) => (
  <Link
    to={to}
    className=" bg-primary text-backgroundcolor p-5 rounded-3xl w-9/12 hover:scale-105 hover:shadow-lg hover:bg-darkPrimary transition-all duration-300 ease-out">
    <button className="text-start">
      <h1 className="font-extrabold text-2xl">{title}</h1>
      <p className="text-base">{description}</p>
    </button>
  </Link>
);

function HomePage() {
  return (
    <>
      <div className="w-screen h-screen bg-backgroundcolor overflow-hidden!">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="flex flex-col justify-center items-center gap-3 w-80 py-4 bg-darkBackgroundcolor man">
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
