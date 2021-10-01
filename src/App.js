import * as THREE from "three";
import { shaderMaterial, OrbitControls, ContactShadows, Environment, calcPosFromAngles,Preload, useProgress, Html } from '@react-three/drei';
import { Canvas, extend, useFrame, useThree, useLoader } from '@react-three/fiber';
import './App.css';
import React, { useRef, Suspense, useState, useEffect, useContext } from 'react'
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import { AmbientLight } from "three";
import glsl from 'babel-plugin-glsl/macro';
import { gsap, CSSPlugin } from 'gsap';
import imageTexture from './assets/moiFond0Satu.png'
import imageTexture2 from './assets/moiFondCouleur.png'







const WaveShaderMaterial = shaderMaterial(
 
  //Uniform
  {
    uTime: 0,
    u_res: new THREE.Vector2(window.innerWidth, window.innerHeight),
    u_imagehover: new THREE.Texture(),
    u_image: new THREE.Texture(),
    u_mouse: new THREE.Vector2(0, 0),
    pr: window.devicePixelRatio.toFixed(1),
    u_circleradius: 0.,
    u_textureOpacity:0.,


  },
  //Vertex Shader
  glsl`
  precision mediump float;
  varying vec2 vUv;
  varying vec2 MyPos;
  varying float vWave;
  uniform float uTime;
  uniform vec2 u_mouse;
  
  
  #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
    void main() {
      vUv = uv;
      vec2 mouse = u_mouse;
      vec3 pos = position;
      vec2 MyPos = position.xy;
      float noiseFreqency = 0.4;
      float amp = 0.6;
     /*  vec3 noisePos = vec3(pos.x * noiseFreqency,0.1, 1. + uTime);
      pos.z += snoise3(noisePos) * amp ;
      vWave = pos.z;  */
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  //Fragment Shader
  glsl`
    precision mediump float;
    uniform vec3 uColor;
    uniform float uTime;

    uniform vec2 u_mouse;
    uniform float uOpacity;
    varying vec2 vUv;
    varying vec2 MyPos;
    uniform vec2 u_res;
    uniform  float pr;
    uniform sampler2D u_image;
    uniform sampler2D u_imagehover;
    uniform float u_circleradius;
    uniform float u_blur;
    uniform float u_textureOpacity;
    #define TWO_PI 6.28318530718
    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

    vec3 hsb2rgb( in vec3 c ){
      vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                               6.0)-3.0)-1.0,
                       0.0,
                       1.0 );
      rgb = rgb*rgb*(3.0-2.0*rgb);
      return c.z * mix( vec3(1.0), rgb, c.y);
  }






  float circle(in vec2 _st, in float _radius, in float blurriness){
    vec2 dist = _st;
    return 1.-smoothstep(_radius-(_radius*blurriness), _radius+(_radius*blurriness), dot(dist,dist)*4.0);
  }
  

    void main() {
      
      vec2 uv = vUv;
      float radius = u_circleradius;
      float u_time = uTime;
      vec2 res = u_res;
      vec2 st = gl_FragCoord.xy / res.xy - vec2(0.5);
      // tip: use the following formula to keep the good ratio of your coordinates
    //  st.y *= u_res.y / u_res.x;
    
      // We readjust the mouse coordinates
      vec2 mouse = u_mouse * -0.5;
      
      vec2 circlePos = st + mouse;
      float textureOpa = u_textureOpacity;
      float variation = abs(sin(radius + mouse.y) * -0.5);
     
      float offx = uv.x + sin(uv.y + u_time * .1);
      float offy = uv.y - u_time * 0.1 - cos(u_time * .001) * .01;
    
      float c = circle(circlePos, variation, 2.) * 2.5;

      float n = snoise3(vec3(offx, offy, u_time * .1) * 8.) - 1.;
      
      float finalMask = smoothstep(0.4, 0.5, n + pow(c, 2.));
      vec4 image = texture2D(u_image, uv) * textureOpa;
      vec4 hover = texture2D(u_imagehover, uv) * textureOpa; 
    
      vec4 finalImage = mix(image, hover, finalMask);

      gl_FragColor = vec4(vec3(finalImage), 1.);

    }
  `


);

extend({ WaveShaderMaterial });

// viewport = canvas in 3d units (meters)







const Plane = (props) => {
  const ref = useRef();
  const shaderRef = useRef();
  const texture_1 = useLoader(TextureLoader, imageTexture);
  const texture_2 = useLoader(TextureLoader, imageTexture2);
  console.log(texture_1)
  useFrame(({ clock }) => (shaderRef.current.uTime = clock.getElapsedTime()));

  const { viewport } = useThree()
  useFrame(({ mouse }) => {
    const x = (mouse.x * viewport.width)
    const y = (mouse.y * viewport.height)
    // ref.current.position.set(x, y, 0)
    /*    ref.current.rotation.set(-y, x, 0) */
  /*   shaderRef.current.u_res.x = viewport.width;
    shaderRef.current.u_res.y = viewport.height; */
    shaderRef.current.u_mouse = mouse;
    shaderRef.current.u_image = texture_1;
    shaderRef.current.u_imagehover = texture_2;
    console.log(mouse);
  })

  useEffect(()=> {
gsap.to(shaderRef.current,{u_circleradius : 0.2,duration: 5,delay:2})
gsap.to(shaderRef.current,{u_textureOpacity:0.8,duration:5 })
  })

 

  return (
    <mesh position={[0, 0, 0]} ref={ref} scale={[viewport.width, viewport.height, 1]}>
      <planeBufferGeometry args={[1, 1, 1, 1]} attach="geometry" rotation={[0, 0, 0]} />
      <waveShaderMaterial attach="material" ref={shaderRef} />
    </mesh>
  )
}


const HomeText = () => {
   return (

            <div className="home-container">
              <div className="left-side"></div>
              <div className="right-side">
                <button className="project-btn">See projects</button>
              </div>
               </div>
  )
}



const  Loader = () => {
  const { active, progress, errors, item, loaded, total } = useProgress();
 const loaderBar = useRef();
console.log(useProgress())
  useEffect(() => {
    gsap.to(loaderBar.current,{width:progress.toFixed(0)})
  })
  return <Html center> <div  className="loading-overlay">
  {/*   <div ref={loaderBar} className="loader-bar" ></div> */}
   {/*  {progress.toFixed(1)} % loaded  */}</div></Html>
}




const Scene = () => {

  /*   const snap = useSnapshot(state)
    const controls = useRef(); */

  return (




    <Canvas>

      <Suspense fallback={<Loader></Loader>}>
        <Plane></Plane>
        <ambientLight></ambientLight>
    
      </Suspense>
      <OrbitControls enabled={false} />
      <ContactShadows></ContactShadows>
    </Canvas>);

}




function App() {
  return (
    <>
    {/* <HomeText></HomeText> */}
    <Scene></Scene>
    </>
  );
}

export default App;
