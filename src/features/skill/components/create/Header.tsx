import React from "react";
import Link from "next/link";
function Header() {
  return (
    <>
      {" "}
      <div className="mb-8">
        <button className="flex items-center gap-2 text-muted">
          {" "}
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.55 6L6.28333 9.73333L5.33333 10.6667L0 5.33333L5.33333 0L6.28333 0.933333L2.55 4.66667H10.6667V6H2.55Z"
              className="fill-muted"
            />
          </svg>
          <Link href="/" className="ml-2">
            Back to Dashboard
          </Link>
        </button>
      </div>
      <div className="flex-col ">
        <h2 className="text-slate-900 font-black text-3xl mb-2">
          Offer a New Skill
        </h2>
        <p className="text-muted text-lg">
          Share your expertise and grow the community. What do you want to
          teach?
        </p>
      </div>
    </>
  );
}

export default Header;
