import cn from "classnames";
import { motion } from "framer-motion";
import Header from "@/layouts/_header";
import DrawersContainer from "@/components/drawer-views/container";
import { useAppSelector } from "../hooks/reduxHooks";
import { selectNewOrder } from "../store/newOrderSlice";
import { InvoiceOptionsHeader } from "./_invoice-option-header";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  const { newOrderInfo } = useAppSelector(selectNewOrder);

  return (
    <motion.div
      initial="exit"
      animate="enter"
      exit="exit"
      className="bg-light-300 dark:bg-dark-100 flex min-h-screen w-full flex-col"
    >
      <Header />
      {newOrderInfo.started ? (
        <>
          <InvoiceOptionsHeader />
          <div className="flex flex-1">
            <main className={cn("flex w-8/12 flex-col")}>{children}</main>
            <DrawersContainer />
          </div>
        </>
      ) : (
        <div className="flex flex-1">
          <main className={cn("flex w-full flex-col")}>{children}</main>
        </div>
      )}
    </motion.div>
  );
}
