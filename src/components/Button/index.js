import React from "react";

export default function () {
  function clickMe() {
    console.log("click me");
  }

  return (
    <button onClick={clickMe}>click me</button>
  )
}
