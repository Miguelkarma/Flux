import { motion } from "framer-motion";
import { JSX } from "react";

type FeatureCardProps = {
  classes?: string;
  children: JSX.Element;
};

const FeatureCard = ({ classes, children }: FeatureCardProps) => {
  return <motion.div className={classes}>{children}</motion.div>;
};

export default FeatureCard;
