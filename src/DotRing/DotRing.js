import React, { useContext } from "react";
import "./DotRing.css";
import { gsap, CSSPlugin, TimelineLite } from 'gsap';
import { MouseContext } from "../context/mouse-context";
import useMousePosition from "../hooks/useMousePosition";


const DotRing = () => {
  const { cursorType, cursorChangeHandler } = useContext(MouseContext);
  const { x, y } = useMousePosition();

/*   var bt = document.querySelectorAll('.ring.Fall'),
	turbVal = { val: 0.000 },
	turb = document.querySelectorAll('#noise feTurbulence')[0],
	
	btTl = new gsap.timeline({ repeat:-1,paused: true, onUpdate: function() {
  turb.setAttribute('baseFrequency', '0 ' + turbVal.val);
} });

btTl.to(turbVal, 4, { val: 0.02 })
.to(turbVal, 4, { val: 0.000 })

if(cursorType == "Fall" || cursorType == "Spring")  {
  btTl.restart();

}; */
  
  return (
    <>
      <div
        style={{ left: `${x}px`, top: `${y}px` }}
        className={"ring " + cursorType}
      >
<p style={{fontFamily: cursorType == 'Spring'? 'Merienda One' :'Merienda One',color:cursorType ==="Play" ||  cursorType ==="Close" ? 'rgb(19, 75, 85)' : 'white',position:"absolute"}}  className={"spring-cursor-txt" + cursorType}>{cursorType}</p>
<svg  viewBox=" 0 0 180 100">
    <filter id="noise" x="0%" y="0%" width="200%" height="200%">
        <feTurbulence baseFrequency="0.01 0.4" result="turbulence" numOctaves="2" >
        <animate id="noiseAnimate" attributeName="baseFrequency" values="0;.1;0,0" from="0" to="100" dur="20s" repeatCount="indefinite"></animate>

        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="4" xChannelSelector="R" yChannelSelector="R"></feDisplacementMap>
    </filter>

    <image  x="0" y="0" width="100%" height="100%" filter="url(#noise)"></image>
</svg>

      </div>
      <div
        className={"dot " + cursorType}
        style={{ left: `${x}px`, top: `${y}px` }}
      ></div>
    </>
  );
};

export default DotRing;