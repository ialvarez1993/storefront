import type { Homepage } from "~/graphql";

const validateSEO = (homepage: Homepage, fullPath: string) => {
  const warnings = [];

  if (!homepage?.metaTitle) {
    warnings.push(
      `[WARNING] - The homepage from slug ${fullPath} does not have the metaTitle.`,
    );
  }
  if (!homepage?.metaDescription) {
    warnings.push(
      `[WARNING] - The homepage from slug ${fullPath} does not have the metaDescription.`,
    );
  }
  if (!homepage?.jsonLd) {
    warnings.push(
      `[WARNING] - The homepage from slug ${fullPath} does not have the jsonLd.`,
    );
  }
  if (!homepage?.metaKeyword) {
    warnings.push(
      `[WARNING] - The homepage from slug ${fullPath} does not have the metaKeyword.`,
    );
  }
  if (!homepage?.metaImage) {
    warnings.push(
      `[WARNING] - The homepage from slug ${fullPath} does not have the metaImage.`,
    );
  }

  warnings.forEach((warning) => console.warn(warning));
};

export default (homepage: Homepage, fullPath: string) => {
  validateSEO(homepage, fullPath);

  return {
    title: "tupunto.com",
    meta: [
      homepage?.metaTitle && {
        hid: "title",
        name: "title",
        content: homepage.metaTitle || "tupunto.com",
      },
      homepage?.metaDescription && {
        hid: "description",
        name: "description",
        content: homepage.metaDescription,
      },
      homepage?.metaDescription && {
        hid: "og:description",
        name: "og:description",
        content: homepage.metaDescription,
      },
      homepage?.metaTitle && {
        hid: "og:title",
        name: "og:title",
        content: homepage.metaTitle || "tupunto.com",
      },
      homepage?.metaTitle && {
        hid: "twitter-title",
        name: "twitter:title",
        content: homepage.metaTitle || "tupunto.com",
      },
      homepage?.metaDescription && {
        hid: "twitter-desc",
        name: "twitter:description",
        content: homepage.metaDescription,
      },
    ].filter(
      (meta): meta is { hid: string; name: string; content: string } => !!meta,
    ), // Filtro para objetos validos válidos
    script: [
      homepage?.jsonLd && {
        type: "application/ld+json",
        children: homepage.jsonLd as any,
      },
    ].filter(Boolean),
    link: [
      {
        rel: "canonical",
        href: `https://tupunto.com${fullPath}`,
      },
    ],
  };
};
