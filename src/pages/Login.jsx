import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "../components/Icons";

export default function Login() {
  return (
    <div className="p-2 bg-backgroundcolor w-screen min-h-screen flex flex-col justify-between">
      <div className="py-3 px-2 xs:px-4 flex justify-between items-center mt-1 mb-5 bg-darkBackgroundcolor rounded-xl">
        <h2 className="text-center text-2xl font-bold">صفحه ورود</h2>
        <Link
          className="flex justify-center items-center border-2 rounded-3xl py-1 pl-2 pr-3 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out bg-darkBackgroundcolor hover:bg-backgroundcolor"
          to={"/"}>
          <span>برگشت</span>
          <Icons.arrow className={"w-6 rotate-180"} />
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="bg-subPrimary flex flex-col justify-center items-center gap-3 p-5 rounded-2xl">
          <h1 className="text-2xl font-bold pb-2 text-backgroundcolor">
            صفحه ورود
          </h1>
          <div className="bg-slowSubPrimary flex justify-between gap-2 p-1 rounded-2xl">
            <button className="border-2 px-1 rounded-xl bg-primary cursor-pointer hover:scale-105 hover:bg-darkPrimary hover:text-backgroundcolor transition-all duration-300 ease-out">
              ارسال
            </button>
            <input
              type="text"
              placeholder="example@mgail.com"
              className="rounded-xl"
            />
          </div>
          <input
            type="text"
            placeholder="code"
            className="bg-slowSubPrimary flex justify-between gap-2 p-1 rounded-xl w-full"
          />
          <button className="border-2 font-bold py-0.5 text-lg bg-primary w-full rounded-2xl cursor-pointer hover:scale-105 hover:bg-darkPrimary hover:text-backgroundcolor transition-all duration-300 ease-out">
            ورود
          </button>
        </div>
      </div>
      <div></div>
    </div>
  );
}
