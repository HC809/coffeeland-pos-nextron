import type { NextPageWithLayout } from "@/types";
import Layout from "@/layouts/_layout";
import CategoryGrid from "../../components/search-products/categories-grid";
import { useAppSelector } from "@/hooks/reduxHooks";
import { selectCategories } from "@/store/categoriesSlice";
import { selectNewOrder } from "../../store/newOrderSlice";

const SearchProductsPage: NextPageWithLayout = () => {
  const { newOrderInfo } = useAppSelector(selectNewOrder);
  const { categories } = useAppSelector(selectCategories);

  return (
    <>
      {newOrderInfo?.started ? (
        <div className="3xl:px-8 flex flex-grow flex-col px-4 pt-6 pb-10 md:px-6 lg:px-7 lg:pb-12">
          <CategoryGrid categories={categories} isLoading={false} />
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

SearchProductsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default SearchProductsPage;
