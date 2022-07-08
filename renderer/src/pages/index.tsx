import type { NextPageWithLayout } from "@/types";
import type { GetStaticProps } from "next";
import Layout from "@/layouts/_layout";
import HomePage from "./home";

export const getStaticProps: GetStaticProps = async () => {
  try {
    return {
      props: {},
      revalidate: 60, // In seconds
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

const Home: NextPageWithLayout = () => {
  return <HomePage />;
};

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Home;
