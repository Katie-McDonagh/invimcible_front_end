import React from "react";
import "./home.css";

export default function Home() {
  return (
    <center>
      <img src={"images/logo.png"} className="logo" />
      <div class="homescreencontainer">
        <img src={"images/home_screen.png"} alt="HomeScreen" id="vimGame"></img>
        <a href="./about">
          <button class="about-btn">ABOUT</button>
        </a>
        <a href="/play">
          <button class="start-btn">START GAME</button>
        </a>
      </div>
    </center>
  );
}
