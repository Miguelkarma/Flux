import { motion } from "motion/react";
import { featureData } from "@/Landing/constants/constants";
import FeaturedCard from "@/Landing/constants/FeatureCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Features() {
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <motion.p className="">{featureData.sectionSubtitle}</motion.p>
            <motion.h2 className="section-title">
              {featureData.sectionTitle}
            </motion.h2>
            <motion.p className="section-text">
              {featureData.sectionText}
            </motion.p>
          </div>
          <div className="">
            {featureData.features.map(
              ({ icon, iconBoxColor, title, desc, imgSrc }, index) => (
                <FeaturedCard key={index}>
                  <>
                    <div className="">
                      <motion.div className={`${iconBoxColor}`}>
                        {icon}
                      </motion.div>
                      <motion.h3 className="">{title}</motion.h3>
                      <motion.p className="">{desc}</motion.p>
                      <motion.div className="">
                        <Button variant="link" className="">
                          Learn more <ArrowRight />
                        </Button>
                      </motion.div>
                    </div>
                    {imgSrc && (
                      <motion.figure className="">
                        <img src={imgSrc} alt="" />
                      </motion.figure>
                    )}
                  </>
                </FeaturedCard>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}
