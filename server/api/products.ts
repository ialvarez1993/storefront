import productFragment from "../fragments/productFragment";

const odooBaseUrl = `http://localhost:8069/graphql/vsf`;

const headers = {
  "Content-Type": "application/json",
  "resquest-host": "localhost:3000",
  "X-Frame-Options": "*",
};

export default defineCachedEventHandler(
  async (event) => {
    const results = await $fetch({
      url: odooBaseUrl,
      method: "post",
      data: {
        query: `
      query products {
        products {
          totalCount
          products {
            ${productFragment}
            }
          }
        }
    `,
      },
      headers,
    });

    const products = results.data.data.products.products;
    return products;
  },
  { maxAge: 60 * 60 * 24 * 7 }
);
