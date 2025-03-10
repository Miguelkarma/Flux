import { motion } from "framer-motion";

import { Variant } from "framer-motion";

interface AnimatedWrapProps {
  initial?: Variant;
  inView?: Variant;
  transition?: object;
  children: React.ReactNode;
  viewportOnce?: boolean;
}

const AnimatedWrap: React.FC<AnimatedWrapProps> = ({
  initial = { opacity: 0, y: -50 },
  inView = { opacity: 1, y: 0 },
  transition = { delay: 0.5, duration: 1.5 },
  children,
  viewportOnce = true,
}) => {
  return (
    <motion.div
      initial="initial"
      whileInView="inView"
      viewport={{ once: viewportOnce }}
      variants={{ initial, inView }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedWrap;
