import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
// import { loadAll } from "@/tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.



const ParticlesComponent = (props) => {

  const [init, setInit] = useState(false);
  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };


  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },

      fpsLimit: 60,

      interactivity: {
        detectsOn: "window",

        events: {
          onClick: {
            enable: window.matchMedia("(hover: none)").matches,
           mode: "bubble",
          },
          onHover: {
            enable: true,
            mode: "bubble", // subtle, premium
            parallax: {
              enable: true,
              force: 10,
              smooth: 20
            },
          },
          resize: true,
        },
        modes: {
          bubble: {
            distance: 250,
            size: 2,          // 👈 scale on hover
            opacity: 0.9,       // 👈 glow intensity
            duration: 0.5,
          },
        },
      },

      particles: {
        number: {
          value: 1000,
          density: {
            enable: true,
            area: 900,
          },
        },

        color: {
          value: ["#ff6b00", "#00f0ff"], // 🔥 warm + ❄ cold
        },
        shadow: {
          enable: true,
          color: "#ffffff", // 👈 matches particle color
          blur: 10,
          offset: {
            x: 1,
            y: 1,
          },
        },

        opacity: {
          value: 0,
        },

        size: {
          value: { min: 1.5, max: 3 },
        },

        links: {
          enable: false,
          color: "#ffffff",
          opacity: 0.15,
          distance: 160,
          width: 1,
        },

        move: {
          enable: true,
          speed: 0.6,
          direction: "random",
          random: false,
          straight: false,
          outModes: {
            default: "out",
          },
        },

        shape: {
          type: "circle"
        },
      },

      detectRetina: true,
    }),
    []
  );



  return <Particles id={props.id} init={particlesLoaded} options={options} />;
};

export default ParticlesComponent;