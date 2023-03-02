import { useRouter } from "next/router";
import React from "react";

function index() {
  const router = useRouter();
  const { address } = router.query;
  return <div>{address}</div>;
}

export default index;
