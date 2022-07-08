import type { NextPageWithLayout } from "@/types";
import Layout from "@/layouts/_layout";
import CategoryGrid from "../../components/search-products/categories-grid";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { selectCategories } from "@/store/categoriesSlice";
import { selectNewOrder } from "../../store/newOrderSlice";
import { resetSales, selectSales } from "@/store/salesSlice";
import { SaleList } from "@/components/sales/sale-list";

const HomePage: NextPageWithLayout = () => {
  const { newOrderInfo } = useAppSelector(selectNewOrder);
  const { categories } = useAppSelector(selectCategories);
  const { sales } = useAppSelector(selectSales);

  const dispatch = useAppDispatch();

  if (newOrderInfo?.started) {
    return (
      <div className="3xl:px-8 flex flex-grow flex-col px-4 pt-6 pb-10 md:px-6 lg:px-7 lg:pb-12">
        <CategoryGrid categories={categories} isLoading={false} />
      </div>
    );
  }

  return (
    <>
      {sales.length > 0 ? (
        <div className="3xl:px-8 flex flex-grow flex-col px-4 pt-6 pb-10 md:px-6 lg:px-7 lg:pb-12">
          {/* <button onClick={() => dispatch(resetSales())}>
            ELIMINAR FACTURAS
          </button> */}
          <div className="group bg-light dark:bg-dark-250 cursor-pointer rounded-md px-4 py-1 text-center">
            <p className="pt-5 text-xl font-bold">Lista de Facturas</p>
            <SaleList sales={sales} />
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center p-4 md:p-6 xl:p-8">
          <div className="max-w-md text-center xl:max-w-lg">
            <img
              width="200px"
              height="150px"
              className="ml-auto mr-auto"
              src="/images/coffeeland-logo.png"
            />
          </div>
        </div>
      )}
    </>
  );
};

HomePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default HomePage;
