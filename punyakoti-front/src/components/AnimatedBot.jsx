export default function AnimatedBot() {
  return (
    <>
      <style>{`
        .bot{
          width:120px;
          animation:float 3s ease-in-out infinite;
        }

        .right-arm{
          transform-origin:60px 20px;
          animation:wave 1.8s infinite ease-in-out;
        }

        @keyframes float{
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-6px)}
        }

        @keyframes wave{
          0%,100%{transform:rotate(0deg)}
          25%{transform:rotate(-18deg)}
          50%{transform:rotate(12deg)}
          75%{transform:rotate(-12deg)}
        }
      `}</style>

      <svg
        className="bot"
        viewBox="0 0 180 220"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Antennas */}
        <line x1="55" y1="22" x2="45" y2="2" stroke="#222" strokeWidth="3" />
        <ellipse cx="43" cy="0" rx="4" ry="6" fill="#222" />

        <line x1="125" y1="22" x2="135" y2="2" stroke="#222" strokeWidth="3" />
        <ellipse cx="137" cy="0" rx="4" ry="6" fill="#222" />

        {/* Head */}
        <rect x="40" y="20" width="100" height="70" rx="28" fill="#6387D9" />

        {/* Ear Pads */}
        <rect x="30" y="48" width="10" height="24" rx="2" fill="#202330" />
        <rect x="140" y="48" width="10" height="24" rx="2" fill="#202330" />

        {/* Visor */}
        <rect x="52" y="35" width="76" height="38" rx="18" fill="#202330" />

        {/* Eyes */}
        <path
          d="M68 54 Q72 46 76 54"
          stroke="#FFD339"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        <path
          d="M104 54 Q108 46 112 54"
          stroke="#FFD339"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Smile */}
        <path
          d="M78 63 Q90 74 102 63"
          stroke="white"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Left Arm */}
        <g>
          <ellipse
            cx="32"
            cy="135"
            rx="15"
            ry="34"
            fill="#6387D9"
            transform="rotate(10 32 135)"
          />
        </g>

        {/* Right Arm */}
        <g className="right-arm">
          <ellipse
            cx="148"
            cy="135"
            rx="15"
            ry="34"
            fill="#6387D9"
            transform="rotate(-10 148 135)"
          />
        </g>

        {/* Body */}
        <path
          d="
            M55 95
            Q90 88 125 95
            L125 150
            Q125 188 90 205
            Q55 188 55 150
            Z"
          fill="#6387D9"
        />

        {/* Neck Line */}
        <path
          d="M72 104 Q90 122 108 104"
          stroke="#4A67B8"
          strokeWidth="2"
          fill="none"
        />

        {/* Bottom Curve */}
        <path
          d="M62 170 Q90 180 118 170"
          stroke="#4A67B8"
          strokeWidth="2"
          fill="none"
        />

        {/* Buttons */}
        <circle cx="90" cy="132" r="4" fill="#202330" />
        <circle cx="90" cy="148" r="4" fill="#202330" />

        {/* Shadow */}
        <ellipse cx="90" cy="216" rx="35" ry="5" fill="#d8d8d8" opacity=".5" />
      </svg>
    </>
  );
}
