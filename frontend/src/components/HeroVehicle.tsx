type WheelProps = {
  cx: number;
  cy: number;
  radius: number;
  perspective?: boolean;
};

function PerformanceWheel({ cx, cy, radius, perspective = false }: WheelProps) {
  return (
    <g className="performance-wheel" transform={`translate(${cx} ${cy})`}>
      <circle r={radius + 5} fill="#010403" opacity=".9" />
      <circle r={radius} fill="url(#tireDepth)" />
      <circle r={radius * .72} fill="#080d0b" stroke="#3f5048" strokeWidth="3" />
      <circle r={radius * .62} fill="url(#rimFace)" stroke="#a3b0aa" strokeOpacity=".5" strokeWidth="2" />
      <circle r={radius * .43} fill="url(#brakeDisc)" stroke="#4f5c56" strokeWidth="2" />
      <circle cx={radius * .17} cy="2" r={radius * .2} fill="#18231e" opacity=".9" />
      <path d={`M${radius * .1}-${radius * .35}A${radius * .37} ${radius * .37} 0 0 1 ${radius * .32}-${radius * .08}`} fill="none" stroke="#9ed968" strokeWidth={radius * .07} strokeLinecap="round" opacity=".68" />
      <g className="forged-spokes" fill="url(#spokeFace)">
        {[0, 40, 80, 120, 160].map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path d={`M-5-${radius * .56} 1-${radius * .22} 7-8 13-${radius * .2} 7-${radius * .57}Z`} />
            <path d={`M5 ${radius * .56}-1 ${radius * .22}-7 8-13 ${radius * .2}-7 ${radius * .57}Z`} />
          </g>
        ))}
      </g>
      <circle r={radius * .2} fill="#111b17" stroke="#7e8d85" strokeWidth="2" />
      <circle className="rim-glow" r={radius * .09} fill="#9de162" />
      {perspective && <ellipse cx={radius * .66} cy="0" rx={radius * .08} ry={radius * .56} fill="#000" opacity=".28" />}
    </g>
  );
}

export function HeroVehicle() {
  return (
    <div className="vehicle-stage" aria-label="Fütüristik performans otomobili görseli">
      <div className="showroom-halo" aria-hidden="true"><i /><i /><i /></div>
      <div className="floor-glow" aria-hidden="true" />

      <svg className="car-visual" viewBox="0 0 1100 510" role="img" aria-label="Koyu metalik renkte modern performans fastback konsept otomobili">
        <defs>
          <linearGradient id="bodyVolume" x1=".08" y1=".08" x2=".94" y2=".88">
            <stop offset="0" stopColor="#53665d" />
            <stop offset=".14" stopColor="#263a31" />
            <stop offset=".42" stopColor="#101d18" />
            <stop offset=".68" stopColor="#23372e" />
            <stop offset=".87" stopColor="#09120f" />
            <stop offset="1" stopColor="#030806" />
          </linearGradient>
          <linearGradient id="upperVolume" x1=".05" y1="0" x2=".9" y2=".85">
            <stop offset="0" stopColor="#7d9086" stopOpacity=".72" />
            <stop offset=".2" stopColor="#30473d" />
            <stop offset=".6" stopColor="#0c1915" />
            <stop offset="1" stopColor="#1c3028" />
          </linearGradient>
          <linearGradient id="bonnetVolume" x1="0" y1="0" x2="1" y2=".7">
            <stop offset="0" stopColor="#63786d" />
            <stop offset=".2" stopColor="#344d42" />
            <stop offset=".48" stopColor="#16271f" />
            <stop offset=".78" stopColor="#0b1612" />
            <stop offset="1" stopColor="#020705" />
          </linearGradient>
          <linearGradient id="sideDepth" x1="0" y1="0" x2=".8" y2="1">
            <stop offset="0" stopColor="#32493f" />
            <stop offset=".48" stopColor="#0d1915" />
            <stop offset="1" stopColor="#050b09" />
          </linearGradient>
          <linearGradient id="glassVolume" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#829f94" stopOpacity=".7" />
            <stop offset=".2" stopColor="#2e5047" stopOpacity=".88" />
            <stop offset=".58" stopColor="#091511" stopOpacity=".98" />
            <stop offset=".82" stopColor="#172c26" stopOpacity=".98" />
            <stop offset="1" stopColor="#45675c" stopOpacity=".68" />
          </linearGradient>
          <linearGradient id="windscreenReflection" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e0efe8" stopOpacity=".36" />
            <stop offset=".38" stopColor="#6d9487" stopOpacity=".12" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="limeEdge" x1="0" x2="1">
            <stop offset="0" stopColor="#9fe461" stopOpacity="0" />
            <stop offset=".2" stopColor="#c9ff91" stopOpacity=".92" />
            <stop offset=".68" stopColor="#8bd653" stopOpacity=".75" />
            <stop offset="1" stopColor="#8bd653" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="headlightLens" x1="0" x2="1">
            <stop offset="0" stopColor="#f7fff0" />
            <stop offset=".42" stopColor="#d0ff9e" />
            <stop offset="1" stopColor="#7bc34a" stopOpacity=".18" />
          </linearGradient>
          <linearGradient id="bodyLightSweep" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".48" stopColor="#edffe2" stopOpacity=".42" />
            <stop offset=".54" stopColor="#fff" stopOpacity=".06" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="tireDepth">
            <stop offset=".7" stopColor="#111714" />
            <stop offset=".85" stopColor="#050806" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <radialGradient id="rimFace">
            <stop offset="0" stopColor="#62736a" />
            <stop offset=".38" stopColor="#18231e" />
            <stop offset=".75" stopColor="#87978f" />
            <stop offset="1" stopColor="#111a16" />
          </radialGradient>
          <radialGradient id="brakeDisc">
            <stop offset="0" stopColor="#1b2420" />
            <stop offset=".72" stopColor="#56635d" />
            <stop offset="1" stopColor="#202a25" />
          </radialGradient>
          <linearGradient id="spokeFace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a3b0aa" />
            <stop offset=".45" stopColor="#26342e" />
            <stop offset="1" stopColor="#77877f" />
          </linearGradient>
          <filter id="studioBlur" x="-60%" y="-120%" width="220%" height="340%"><feGaussianBlur stdDeviation="15" /></filter>
          <filter id="ledGlow" x="-150%" y="-180%" width="400%" height="460%">
            <feGaussianBlur stdDeviation="7" result="ledBlur" />
            <feMerge><feMergeNode in="ledBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="bodySweepClip">
            <path d="M83 340C103 292 151 270 244 255 320 243 364 234 425 222 502 207 610 200 733 208 850 215 960 241 1023 281 1044 294 1051 317 1040 350 992 369 923 379 833 386L185 385C125 379 94 366 83 340Z" />
          </clipPath>
        </defs>

        <g className="vehicle-ground">
          <ellipse cx="569" cy="424" rx="449" ry="42" fill="#000" opacity=".68" filter="url(#studioBlur)" />
          <ellipse className="underbody-light" cx="580" cy="407" rx="350" ry="16" fill="#94e65b" opacity=".22" filter="url(#studioBlur)" />
          <path d="M155 429C361 445 734 441 994 416" fill="none" stroke="url(#limeEdge)" strokeWidth="3" opacity=".3" />
        </g>

        <g className="vehicle-body">
          {/* Low curved outer shell with a believable short rear and front overhang. */}
          <path d="M83 340C103 292 151 270 244 255 320 243 364 234 425 222 502 207 610 200 733 208 850 215 960 241 1023 281 1044 294 1051 317 1040 350 992 369 923 379 833 386L185 385C125 379 94 366 83 340Z" fill="url(#bodyVolume)" />

          {/* Entirely new low-slung upper body with a shallow roof plateau and tight fastback taper. */}
          <g className="upper-body">
            <path d="M323 252C357 230 389 196 429 170C465 147 507 143 559 144C611 144 650 149 681 162C714 176 741 198 779 230C673 217 564 214 457 222C402 226 358 238 323 252Z" fill="url(#upperVolume)" />

            {/* Rear quarter glass, side windows and sharply raked windscreen are individually shaped. */}
            <path d="M371 222C393 200 415 181 442 165C459 155 475 151 491 149L469 215C435 216 402 219 371 222Z" fill="url(#glassVolume)" />
            <path d="M500 149C539 146 579 147 614 151L626 212C578 211 529 212 480 214Z" fill="url(#glassVolume)" />
            <path d="M625 153C649 157 669 164 688 175C713 189 733 205 753 222C717 217 678 214 638 212Z" fill="url(#glassVolume)" />
            <path d="M635 157C655 161 674 168 690 178C711 190 728 204 746 218L640 209Z" fill="url(#windscreenReflection)" opacity=".5" />

            {/* Metallic A-, B- and C-pillars frame the compact horizontal glasshouse. */}
            <path d="M493 149 472 216M617 151 631 213M443 165 367 224" fill="none" stroke="#9db2a8" strokeOpacity=".3" strokeWidth="5" strokeLinecap="round" />
            <path d="M440 162C485 139 557 137 616 143C651 146 677 154 699 168" fill="none" stroke="#b4c4bc" strokeOpacity=".3" strokeWidth="2" strokeLinecap="round" />

            {/* Strong shoulder transition visually separates the low cabin from the door volume. */}
            <path d="M326 251C432 223 576 211 756 224C779 226 800 229 821 233" fill="none" stroke="#91aa9e" strokeOpacity=".38" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Long bonnet aimed toward the near front corner. */}
          <path d="M737 207C824 211 914 230 995 268 1017 278 1031 290 1038 307 934 285 844 280 735 286L636 273Z" fill="url(#bonnetVolume)" />
          <path d="M718 222C818 225 914 243 996 277" fill="none" stroke="#93aa9e" strokeOpacity=".42" strokeWidth="2" />
          <path d="M727 243C816 247 904 260 988 288" fill="none" stroke="#08110e" strokeOpacity=".66" strokeWidth="7" />

          {/* Sculpted side volume, not a flat side panel. */}
          <path d="M112 331C244 287 393 272 574 272 755 272 914 287 1035 321 952 326 877 339 805 363 658 378 485 382 277 373 201 367 146 353 112 331Z" fill="url(#sideDepth)" opacity=".88" />
          <path d="M125 312C289 286 442 276 602 277 759 278 887 289 1005 315" fill="none" stroke="#6f8a7c" strokeOpacity=".4" strokeWidth="3" />
          <path d="M144 300C321 293 470 288 609 282 754 276 880 280 983 297" fill="none" stroke="url(#limeEdge)" strokeWidth="3" opacity=".6" />
          <path d="M171 359C367 372 654 373 886 354" fill="none" stroke="#a2b2aa" strokeOpacity=".18" strokeWidth="2" />

          {/* Doors, handles and lower side skirt. */}
          <path d="M475 218C471 257 468 304 465 352M631 213C645 257 663 309 676 355" fill="none" stroke="#9dafA5" strokeOpacity=".15" strokeWidth="2" />
          <path d="M513 254h59M698 250h55" fill="none" stroke="#aebdb6" strokeOpacity=".44" strokeWidth="4" strokeLinecap="round" />
          <path d="M159 370C369 389 728 391 944 362L917 390 192 397Z" fill="#030806" />
          <path d="M199 386C404 397 703 396 896 380" fill="none" stroke="#78a157" strokeOpacity=".24" strokeWidth="3" />

          {/* Deep front fascia in 3/4 perspective. */}
          <path d="M901 292C963 288 1011 298 1040 319L1038 355C1008 374 955 382 884 381L838 359 866 322Z" fill="#050a08" />
          <path d="M910 333C959 326 999 328 1033 339L1026 358C986 355 949 359 908 370L871 357Z" fill="#111b17" />
          <path d="M941 344C974 341 1004 343 1027 349" fill="none" stroke="#5e7267" strokeOpacity=".55" strokeWidth="2" />
          <path d="M1017 305 1040 319 1038 355 1024 361Z" fill="#1d3027" opacity=".75" />

          {/* Slim front LEDs and restrained rear light signature. */}
          <g className="front-light" filter="url(#ledGlow)">
            <path d="M857 275C919 274 970 283 1014 302 959 296 913 299 861 310L817 294Z" fill="url(#headlightLens)" />
            <path d="M853 309C909 295 959 294 1011 303" fill="none" stroke="#ceff9b" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g className="rear-light" filter="url(#ledGlow)">
            <path d="M103 311C145 286 190 276 245 276L215 301 104 327Z" fill="#8fd455" opacity=".5" />
            <path d="M110 308C154 290 191 284 226 285" fill="none" stroke="#c0fa8a" strokeOpacity=".8" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Arch lips align with circular wheels and keep the body visually low. */}
          <path d="M189 362C191 296 235 255 294 255 354 255 395 297 397 364" fill="none" stroke="#82968c" strokeOpacity=".38" strokeWidth="4" />
          <path d="M771 365C774 283 828 232 900 232 974 232 1020 285 1018 355" fill="none" stroke="#8ca096" strokeOpacity=".42" strokeWidth="4" />

          <g clipPath="url(#bodySweepClip)">
            <rect className="body-sweep" x="-390" y="72" width="360" height="340" fill="url(#bodyLightSweep)" transform="skewX(-16)" />
          </g>
        </g>

        {/* The nearer front wheel is subtly larger to create 3/4 perspective. */}
        <PerformanceWheel cx={294} cy={363} radius={72} />
        <PerformanceWheel cx={900} cy={361} radius={84} perspective />
      </svg>

      <div className="vehicle-reflection" aria-hidden="true" />
    </div>
  );
}
