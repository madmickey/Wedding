import { writeFileSync } from "node:fs";

// name -> Google Photos share link. Each album is written to photos-<name>.json
// (the name must match the data-src in photo-wall.html).
const ALBUMS = {
  ceremony: "https://photos.app.goo.gl/XyrTqm3JVjY4Riic9",
  reception: "https://photos.app.goo.gl/SECOND_ALBUM_LINK", // replace with your second album link
};

let failed = false;

for (const [name, link] of Object.entries(ALBUMS)) {
  if (link.includes("SECOND_ALBUM_LINK")) {
    console.log(`${name}: link not set yet, skipping`);
    continue;
  }

  try {
    const res = await fetch(link, {
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 (compatible; photo-wall-refresh)" },
    });
    const html = await res.text();
    const urls = [...new Set(
      html.match(/https:\/\/lh3\.googleusercontent\.com\/pw\/[\w-]+/g) || []
    )];

    console.log(`${name}: HTTP ${res.status}, found ${urls.length} photos`);

    if (!urls.length) {
      console.error(`${name}: no photos found, leaving photos-${name}.json unchanged`);
      failed = true;
      continue;
    }
    writeFileSync(`photos-${name}.json`, JSON.stringify(urls, null, 2) + "\n");
  } catch (err) {
    console.error(`${name}: ${err.message}`);
    failed = true;
  }
}

if (failed) process.exit(1);
