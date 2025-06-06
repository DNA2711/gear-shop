import React from "react";
import Image from "next/image";
import { Fragment } from "react";
import Homepage from "@/components/pages/homepage";

export default async function Home() {
  const data = await base("products").select({}).all();
  return (
    <Fragment>
      <Homepage data={JSON.stringify(data)} />
    </Fragment>
  );
}
