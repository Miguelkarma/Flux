import { motion } from "motion/react";
import * as variants from "@/Animation/motionVariants";
import { reviewData } from "./constants/constants";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Quote } from "lucide-react";

const Review = () => {
  return (
    <section id="reviews" className="section">
      <div className="landing-container relative">
        <div className="section-head">
          <motion.p
            variants={variants.fadeInUp}
            initial="start"
            whileInView={"end"}
            viewport={{ once: true }}
            className="section-subtitle"
          >
            {reviewData.sectionSubtitle}
          </motion.p>
          <motion.h2
            variants={variants.fadeInUp}
            initial="start"
            whileInView={"end"}
            viewport={{ once: true }}
            className="section-title "
          >
            {reviewData.sectionTitle}
          </motion.h2>
        </div>
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 "
          variants={variants.staggerContainer}
          initial="start"
          whileInView={"end"}
          viewport={{ once: true }}
        >
          {reviewData.reviewCard.map(
            ({ title, text, reviewAuthor, date }, index) => (
              <motion.div key={index} variants={variants.fadeInUp}>
                <Card className="relative bg-gradient-to-b from-transparent via-sky-950/10 to-cyan-200/20 border border-slate-600 text-white ">
                  <CardHeader>
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400 line-clamp-3">
                      {text}
                    </p>
                  </CardContent>

                  <CardFooter className="block">
                    <p>{reviewAuthor}</p>
                    <p className="text-xs text-slate-400">{date}</p>
                  </CardFooter>
                  <div className="absolute bottom-0 right-3 opacity-[0.15]">
                    <Quote size={80} />
                  </div>
                </Card>
              </motion.div>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Review;
