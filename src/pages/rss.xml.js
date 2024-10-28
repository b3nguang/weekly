import rss from "@astrojs/rss";

export function GET() {
  let allPosts = import.meta.glob("./posts/*.md", { eager: true });
  let posts = Object.values(allPosts);

  posts = posts.sort((a, b) => {
    const getPostNumber = (url) =>
      parseInt(url.split("/posts/")[1].split("-")[0]);
    return getPostNumber(b.url) - getPostNumber(a.url);
  });

  // Only 12 are kept
  posts = posts.slice(0, 12);

  return rss({
    title: "潮流周刊",
    description: "记录 b3nguang 的不枯燥生活",
    site: "https://weekly.b3nguang.top/",
    customData: `<image><url>https://b3nguang.oss-cn-hangzhou.aliyuncs.com/static/logo.png</url></image><follow_challenge><feedId>41147805276726275</feedId><userId>42909600318350336</userId></follow_challenge>`,
    items: posts.map((item) => {
      const [issueNumber, issueTitle] = item.url.split("/posts/")[1].split("-");
      const title = `第${issueNumber}期 - ${issueTitle}`;
      return {
        link: item.url,
        title,
        description: item.compiledContent(),
        pubDate: item.frontmatter.date,
      };
    }),
  });
}