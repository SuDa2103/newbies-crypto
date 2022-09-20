import Link from "next/link";
import React from "react";

const HomeIcon = () => {
  return (
    <section className="home-wrapper">
      <span className="home">
        <svg
          style={{ width: "20px", height: "20px" }}
          height="30"
          viewBox="0 0 30 30"
          width="30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <rect
              fill="none"
              id="canvas_background"
              height="602"
              width="802"
              y="-1"
              x="-1"
            />
          </g>
          <g>
            <g stroke="null" fill="none">
              <path
                stroke="null"
                className="db-SideNav-iconFill--secondary"
                d="m17.92309,28.20683l0,-6.48556a1.14283,1.14283 0 0 0 -1.15616,-1.13521l-3.40182,0a1.15045,1.15045 0 0 0 -1.15616,1.13521l0,6.48556l-7.61886,0a1.90091,1.90091 0 0 1 -1.90472,-1.90091l0,-13.34253c0,-0.7257 0.41523,-1.38854 1.06664,-1.70663l11.35211,-9.33311l11.2302,9.31216a1.899,1.899 0 0 1 1.11235,1.72758l0,13.34253a1.90091,1.90091 0 0 1 -1.90281,1.90091l-7.62077,0zm-2.85707,-11.80924a2.47613,2.47613 0 1 0 0,-4.95226a2.47613,2.47613 0 0 0 0,4.95226z"
              />
              <path
                stroke="null"
                className="db-SideNav-iconFill--primary"
                d="m15.06983,1.48176a0.7676,0.7676 0 0 0 -0.58475,0.1619l-13.60539,11.01688a0.76189,0.76189 0 0 0 -0.11428,1.08569l1.42854,1.76186c0.26285,0.3238 0.75236,0.38094 1.08188,0.11428l11.794,-9.55215l11.79591,9.55215c0.32952,0.26666 0.81903,0.20952 1.08569,-0.11428l1.42473,-1.76377a0.76189,0.76189 0 0 0 -0.11428,-1.08569l-13.60539,-11.01307a0.7676,0.7676 0 0 0 -0.58665,-0.1619l0,-0.0019z"
              />
            </g>
          </g>
        </svg>

        <Link href="/">
          <a>Home</a>
        </Link>
      </span>
    </section>
  );
};

export default HomeIcon;
