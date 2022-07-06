import type { NextPageWithLayout } from "@/types";
import Layout from "@/layouts/_layout";
import { useAppSelector } from "@/hooks/reduxHooks";
import { selectCategories } from "@/store/categoriesSlice";
import { selectNewOrder } from "../../store/newOrderSlice";

import Table from 'react-tailwind-table';
import 'react-tailwind-table/dist/index.css';

const SalesPage: NextPageWithLayout = () => {
  return (
    <>
     <Table columns={[]} rows={[]} />
    </>
  );
};

SalesPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default SalesPage;
