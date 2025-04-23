import { motion } from "motion/react";
import * as variants from "@/Animation/motionVariants";
import { blogData } from "./constants/constants";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Blog = () => {
  return (
    <section id="blog" className="section">
      <div className="container relative">
        <motion.div
          className="absolute top-0 -right-20 w-1/6 h-1/4 bg-sky-200/40 blur-[100px] -z-10 opacity-60 mix-blend-screen"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 2, opacity: 1 }}
          transition={{ duration: 1.5, ease: "backInOut" }}
          style={{ willChange: "transform, opacity" }}
        />

        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 2, opacity: 1 }}
          transition={{ duration: 1.5, ease: "backOut" }}
          className="absolute top-0 -right-20 w-1/6 h-1/5 bg-cyan-400/80 blur-[100px] -z-10 opacity-60 mix-blend-screen"
          style={{
            willChange: "transform, opacity",
            transform: "translate(25%, 25%) scale(1.25, 0.8)",
          }}
        />

        <div className="section-head">
          <motion.p
            variants={variants.fadeInUp}
            initial="start"
            whileInView={"end"}
            viewport={{ once: true }}
            className="section-subtitle"
          >
            {blogData.sectionSubtitle}
          </motion.p>
          <motion.h2
            variants={variants.fadeInUp}
            initial="start"
            whileInView={"end"}
            viewport={{ once: true }}
            className="section-title"
          >
            {blogData.sectionTitle}
          </motion.h2>
          <motion.p
            variants={variants.fadeInUp}
            initial="start"
            whileInView={"end"}
            viewport={{ once: true }}
            className="section-text"
          >
            {blogData.sectionText}
          </motion.p>
        </div>
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          variants={variants.staggerContainer}
          initial="start"
          whileInView={"end"}
          viewport={{ once: true }}
        >
          {blogData.blogs.map(
            (
              {
                href,
                imgSrc,
                title,
                badge,
                author: { avatarSrc, authorName, publishDate, readingTime },
              },
              index
            ) => (
              <motion.div key={index} variants={variants.fadeInUp}>
                <Card className="group bg-gradient-to-t from-transparent via-sky-950/10 to-cyan-200/30  text-white border-slate-600">
                  <CardHeader>
                    <figure className="rounded-lg overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={title}
                        className="img-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </figure>
                  </CardHeader>
                  <CardContent>
                    <Badge className="mb-3 bg-slate-700 text-white hover:bg-slate-800">
                      {badge}
                    </Badge>
                    <CardTitle className="leading-normal">
                      <a
                        href={href || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-teal-400 transition-colors"
                      >
                        {title}
                      </a>
                    </CardTitle>
                  </CardContent>
                  <CardFooter className="gap-3">
                    <Avatar>
                      <AvatarImage src={avatarSrc} />
                      <AvatarFallback>{authorName}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm mb-0.5">{authorName}</p>
                      <div className="flex items-center gap-1.5">
                        <time
                          dateTime={publishDate}
                          className="text-xs text-slate-400"
                        >
                          {publishDate}
                        </time>
                        <span className="w-1 h-1 bg-muted-foreground/50 rounded-full"></span>
                        <p className="text-xs text-slate-400">{readingTime}</p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
