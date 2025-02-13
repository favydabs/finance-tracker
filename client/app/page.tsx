"use client";
import { useUser } from "@clerk/nextjs";
import FinancialRecordForm from "@/app/dashboard/financial-record-form";
import FinancialRecordList from "./dashboard/financial-record-list";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="container mx-auto  ">
      <h1 className=" flex text-center justify-center text-2xl">
        Welcome
        <span className="font-semibold ml-1 mr-1">{user?.firstName}</span>
        <span className="font-semibold ml-1 mr-1">{user?.lastName}</span>
        To Your Financial Record
      </h1>

      <div className=" flex items-center justify-center mt-4 ">
        <FinancialRecordForm />
      </div>
      <div className="flex justify-center mt-8">
        <FinancialRecordList />
      </div>
    </div>
  );
}
