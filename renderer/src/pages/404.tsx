import type { NextPageWithLayout } from "@/types";
import Layout from "@/layouts/_layout";
import { ErrorIcon } from "@/components/icons/error-icon";
import { HomeIcon } from "@/components/icons/home-icon";
import AnchorLink from "@/components/ui/links/anchor-link";
import routes from "@/config/routes";

const ErrorPage: NextPageWithLayout = () => {
  return (
    <>
      <div className="flex h-full items-center justify-center p-4 md:p-6 xl:p-8">
        <div className="max-w-md text-center xl:max-w-lg">
          <AnchorLink
            href={routes?.home}
            className="group border-light-400 text-dark hover:bg-light-400 hover:text-brand-dark dark:border-dark-400 dark:text-light dark:hover:bg-dark-400 dark:focus:bg-dark-400 mx-auto mt-7 inline-flex items-center gap-2 rounded border px-6 py-3.5 font-semibold transition-all md:mt-9"
          >
            <HomeIcon className="text-dark/40 group-hover:text-brand dark:text-light/60 h-[18px] w-[18px]" />{" "}
            Iniciar
          </AnchorLink>
        </div>
      </div>
    </>
  );
};

ErrorPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ErrorPage;
