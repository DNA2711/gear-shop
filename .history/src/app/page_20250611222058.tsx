import React from "react";

import Homepage from "@/components/pages/homepage.tsx";

export default async function Home() {
  return <Homepage data={JSON.stringify({})} />;
}
