import { motion, AnimatePresence } from "framer-motion";
import Header from "@/layouts/_header";
import { fadeInBottom } from "@/lib/framer-motion/fade-in-bottom";

export default function DashboardLayout({
  children,
}: React.PropsWithChildren<{}>) {
  return (
    <motion.div
      initial="exit"
      animate="enter"
      exit="exit"
      className="bg-light dark:bg-dark-100 lg:bg-light-300 flex min-h-full flex-col lg:min-h-[auto]"
    >
      <Header />
      <motion.div
        variants={fadeInBottom()}
        className="3xl:my-14 mx-auto my-6 w-full max-w-screen-xl flex-1 px-4 sm:my-8 sm:px-5 md:my-10 xl:my-12"
      >
        <div className="lg:shadow-card flex w-full flex-col rounded-lg lg:min-h-[70vh] lg:flex-row 2xl:min-h-[630px]">
          <main className="lg:bg-light lg:dark:bg-dark-250 flex w-full flex-grow flex-col lg:flex-grow-0 lg:py-8 lg:px-12">
            <AnimatePresence
              exitBeforeEnter
              initial={false}
              onExitComplete={() => window.scrollTo(0, 0)}
            >
              {children}
            </AnimatePresence>
          </main>
        </div>
      </motion.div>
    </motion.div>
  );
}
