import { writeFileSync } from "node:fs";

// name -> Google Photos share link. Each album is written to photos-<name>.json
// (the name must match the data-src in photos.html).
const ALBUMS = {
  top50: "https://photos.app.goo.gl/xiQcKVfM3T8EsQAC6",
  reception: "https://photos.app.goo.gl/uduTW5yoTay2xiNr6",
};

let failed = false;

for (const [name, link] of Object.entries(ALBUMS)) {
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
