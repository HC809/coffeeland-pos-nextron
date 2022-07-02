import { motion, AnimatePresence } from "framer-motion";
import Header from "@/layouts/_header";
import { fadeInBottom } from "@/lib/framer-motion/fade-in-bottom";
import Copyright from "@/layouts/_copyright";

export default function GeneralLayout({
  children,
}: React.PropsWithChildren<{}>) {
  return (
    <motion.div
      initial="exit"
      animate="enter"
      exit="exit"
      className="bg-light-300 dark:bg-dark-100 flex min-h-screen w-full flex-col"
    >
      <Header />
      <motion.div
        variants={fadeInBottom()}
        className="flex flex-1 flex-col justify-between"
      >
        <main className="flex w-full flex-grow flex-col">
          <AnimatePresence
            exitBeforeEnter
            initial={false}
            onExitComplete={() => window.scrollTo(0, 0)}
          >
            {children}
          </AnimatePresence>
        </main>
        <Copyright className="text-dark-700 px-4 py-7 text-center font-medium md:py-10 lg:px-8" />
      </motion.div>
    </motion.div>
  );
}
