import type { NextPageWithLayout } from "@/types";
import Layout from "@/layouts/_layout";
import { useAppSelector } from "@/hooks/reduxHooks";
import { resetSales, selectSales } from "../../store/salesSlice";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { SaleList } from "@/components/sales/sale-list";

const SalesPage: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();

  const { sales } = useAppSelector(selectSales);

  return (
    <div className="3xl:px-8 flex flex-grow flex-col px-4 pt-6 pb-10 md:px-6 lg:px-7 lg:pb-12">
      <button onClick={() => dispatch(resetSales())}>ELIMINAR FACTURAS</button>
      <div className="group bg-light dark:bg-dark-250 cursor-pointer rounded-md px-4 py-1 text-center">
        <SaleList sales={sales} />
      </div>
    </div>
  );
};

SalesPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default SalesPage;
