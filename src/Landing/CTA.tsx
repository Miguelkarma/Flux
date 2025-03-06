import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="border-t">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
      >
        <div className="container flex flex-col items-center gap-4 py-24 text-center md:py-32">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
            Streamline Your IT Asset Management
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Simplify asset tracking, optimize resource utilization, and gain
            full visibility into your IT infrastructure with our powerful asset
            management solution.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
