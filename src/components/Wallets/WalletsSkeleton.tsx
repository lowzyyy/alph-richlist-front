import React from "react";

function WalletsSkeleton() {
  return (
    <div className="">
      {[...Array(100).keys()].map((el, i) => (
        <div className={`mb-2 flex animate-pulse flex-col gap-2 bg-gray-100 p-2`} key={i}>
          <div className="h-4 bg-gray-200">
            <span></span>
          </div>
          <div className="h-4 bg-gray-200">
            <span></span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WalletsSkeleton;
