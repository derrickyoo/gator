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

  const channel = result.rss?.channel;
  if (!channel) {
    throw new Error("failed to parse channel");
  }

  if (
    !channel.title ||
    !channel.link ||
    !channel.description ||
    !channel.item
  ) {
    throw new Error("failed to parse channel");
  }

  const items: any[] = Array.isArray(channel.item)
    ? channel.item
    : [channel.item];

  const rssItems: RSSItem[] = items
    .filter(
      (item) => item.title && item.link && item.description && item.pubDate,
    )
    .map((item) => ({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubdate,
    }));

  const rssFeed: RSSFeed = {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: rssItems,
    },
  };

  return rssFeed;
}
