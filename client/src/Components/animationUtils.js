// animationUtils.js

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.5,
    },
  },
};

export const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: .7 },
};
