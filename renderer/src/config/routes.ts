const routes = {
  home: '/products-search',
  sales: '/sales',
  taxInfo: '/tax-info',
  productsSearch: '/products-search',
  productsSearchUrl: (categoryName: string) =>
    `/products-search/${categoryName}`,
};

export default routes;
