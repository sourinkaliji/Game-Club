import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "../components/Icons";

export default function Profile() {
  return (
    <div className="p-2 bg-backgroundcolor w-screen min-h-screen flex flex-col justify-between">
      <div className="py-3 px-2 xs:px-4 flex justify-between items-center mt-1 mb-5 bg-darkBackgroundcolor rounded-xl">
        <h2 className="text-center text-2xl font-bold">صفحه پروفایل</h2>
        <Link
          className="flex justify-center items-center border-2 rounded-3xl py-1 pl-2 pr-3 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out bg-darkBackgroundcolor hover:bg-backgroundcolor"
          to={"/"}>
          <span>برگشت</span>
          <Icons.arrow className={"w-6 rotate-180"} />
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="bg-subPrimary flex flex-col justify-center items-center gap-3 p-5 rounded-2xl">
          <h1>skalk</h1>
        </div>
      </div>
      <div></div>
    </div>
  );
}
