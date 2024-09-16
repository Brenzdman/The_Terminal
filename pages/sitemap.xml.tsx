import { GetServerSideProps } from "next";

const Sitemap = () => {
  return null; // This page will not render anything
};

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const baseUrl = `https://${req.headers.host}`;

  // Constructing the sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}/</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
  </urlset>`;

  // Setting response headers
  res.setHeader("Content-Type", "application/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {}, // No props needed
  };
};

export default Sitemap;
