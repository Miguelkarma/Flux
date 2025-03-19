import { Variants } from "framer-motion";

const easing = [0.6, -0.05, 0.01, 0.99];

export const fadeIn: Variants = {
  start: {
    opacity: 0,
    scale: 0.95,
  },
  end: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: easing,
    },
  },
};

export const fadeInUp: Variants = {
  start: {
    y: 30,
    opacity: 0,
  },
  end: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: easing,
    },
  },
};

export const fadeInRight: Variants = {
  start: {
    x: -30,
    opacity: 0,
  },
  end: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: easing,
    },
  },
};

export const fadeInLeft: Variants = {
  start: {
    x: 30,
    opacity: 0,
  },
  end: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: easing,
    },
  },
};

export const fadeInScale: Variants = {
  start: {
    scale: 0.8,
    opacity: 0,
  },
  end: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.7,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      duration: 0.8,
    },
  },
};

export const lazyLoad: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};


