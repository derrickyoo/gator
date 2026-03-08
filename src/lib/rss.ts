import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
  const headers = new Headers();
  headers.append("User-Agent", "gator");
  headers.append("accept", "application/rss+xml");

  const res = await fetch(feedURL, {
    method: "GET",
    headers,
  });
  if (!res.ok) {
    throw new Error(`failed to fetch feed: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  const parser = new XMLParser();
  const result = parser.parse(xml);

  // TODO: build RSSFeed object
  console.log("🚀 ~ fetchFeed ~ result:", result);
}
