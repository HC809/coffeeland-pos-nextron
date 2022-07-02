import { motion } from "framer-motion";
import { fadeInBottom } from "@/lib/framer-motion/fade-in-bottom";

export default function GeneralContainer({
  children,
}: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-light shadow-card dark:bg-dark-200 xs:p-5 relative flex w-full flex-col overflow-hidden rounded-md p-4 dark:shadow-none md:p-8 lg:flex-row lg:p-0">
      <motion.div
        variants={fadeInBottom()}
        className="w-full flex-grow pt-4 pb-4 sm:pb-2 md:pt-10 lg:p-10 xl:p-12"
      >
        {children}
      </motion.div>
    </div>
  );
}
