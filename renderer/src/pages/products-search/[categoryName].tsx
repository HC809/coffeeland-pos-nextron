import type { NextPageWithLayout } from "@/types";
import Layout from "@/layouts/_layout";
import Image from "@/components/ui/image";
import placeholder from "@/assets/images/placeholders/product.svg";
import { useRouter } from "next/router";
import { useAppSelector } from "@/hooks/reduxHooks";
import { selectProductByCategoryId } from "@/store/productsSlice";
import { selectCategoryByName } from "@/store/categoriesSlice";
import ProductsGrid from "@/components/search-products/products-grid";
import { selectNewOrder } from "@/store/newOrderSlice";

function CategoryProductsGrid({ categoryId }: { categoryId: number }) {
  const products = useAppSelector(selectProductByCategoryId(categoryId));
  return <ProductsGrid products={products} />;
}

const CategoryProductsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { categoryName } = router.query;

  const { newOrderInfo } = useAppSelector(selectNewOrder);
  const category = useAppSelector(selectCategoryByName(categoryName as string));

  return (
    <>
      {!newOrderInfo?.started ? (
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
      ) : (
        <>
          <div className="relative w-full">
            <div className="absolute top-0 left-0 h-full w-full">
              <img
                height={50}
                className="absolute top-0 left-0 h-full w-full"
                src="/images/cover-image.jpg"
              />
            </div>
            <div className="dark:bg-dark/[0.85] relative z-10 h-full w-full bg-white/[0.85] px-4 pt-10 pb-16 text-center backdrop-blur-sm lg:px-8 lg:pt-5 lg:pb-5">
              <div className="3xl:h-[100px] 3xl:w-[100px] relative mx-auto h-[75px] w-[75px] md:h-20 md:w-20 2xl:h-[90px] 2xl:w-[90px]">
                <Image
                  alt={category?.name}
                  layout="fill"
                  objectFit="cover"
                  quality={100}
                  src={
                    category?.image
                      ? `data:image/jpeg;base64,${category.image}`
                      : placeholder
                  }
                />
              </div>
              <h1 className="text-dark-100 mt-3 text-lg font-extrabold 2xl:mt-4">
                {category?.name}
              </h1>
            </div>
          </div>
          <div className="3xl:px-8 flex flex-grow flex-col px-4 pt-6 pb-10 md:px-6 lg:px-7 lg:pb-12">
            <CategoryProductsGrid categoryId={category?.id || 0} />
          </div>
        </>
      )}
    </>
  );
};

CategoryProductsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default CategoryProductsPage;
