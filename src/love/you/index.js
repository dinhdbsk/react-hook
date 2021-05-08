import React from "react";

export default function () {
  function clickMe() {
    console.log("click you");
  }

  return (
    <button onClick={clickMe}>click you</button>
  )
}
