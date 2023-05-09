const getHeightType = (withGen: number | null, withoutGen: number | null) => {
  if (withGen && withoutGen) return "high";
  else if (!withGen && !withoutGen) return "low";
  else return "high";
};

export const heights: {
  [key in "mobile" | "small" | "bigger_small" | "smaller_big" | "big"]: {
    [index: string]: string;
  };
} = {
  mobile: {
    low: "120px",
    high: "200px",
  },
  small: {
    low: "120px",
    high: "220px",
  },
  bigger_small: {
    low: "150px",
    high: "240px",
  },
  smaller_big: { low: "150px", high: "250px" },
  big: { low: "150px", high: "265px" },
};

export const getHeight = (withGen: number | null, withoutGen: number | null) => {
  const heightType = getHeightType(withGen, withoutGen);
  if (window.innerWidth <= 450) {
    return heights.mobile[heightType];
  } else if (window.innerWidth > 450 && window.innerWidth <= 768) {
    return heights.small[heightType];
  } else if (window.innerWidth > 768 && window.innerWidth <= 1024) {
    return heights.bigger_small[heightType];
  } else if (window.innerWidth > 1024 && window.innerWidth <= 1280) {
    return heights.smaller_big[heightType];
  } else {
    return heights.big[heightType];
  }
};
