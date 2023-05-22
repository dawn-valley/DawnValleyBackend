// https://payloadcms.com/community-help/discord/programatically-upload-media
// https://payloadcms.com/community-help/discord/how-to-upload-image-file-to-media-collection-with-payload-handler

import payload from "payload";
// import { Media } from 'payload/types';
import path from 'path';
import fs from 'fs';
// npm run generate:types
import { Media } from "../src/payload-types";

// run with `PAYLOAD_CONFIG_PATH=src/payload.config.ts npx ts-node scripts/create-media.ts`
// or create a script

require('dotenv').config();

const IMPORT_MEDIA_FOLDER = "../importMedia/01-05-03-2023";
const IMPORT_MEDIA_PATH = path.resolve(__dirname, IMPORT_MEDIA_FOLDER);

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// db.getCollection('media').count({})
// db.getCollection('media').remove({})
// db.getCollection('media').find({})

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    // enables local mode, doesn't spin up a server or frontend
    local: true,
  });

  // const media = await payload.create<Media>({
  //   collection: 'media',
  //   data: {
  //     description: "Seed Beer"
  //   },
  //   filePath: `${IMPORT_MEDIA_PATH}/Partida Iniciática Evangelica Minhas com Humahã.pdf`,
  // });
  // console.log(media);

  // https://stackoverflow.com/questions/2727167/how-do-you-get-a-list-of-the-names-of-all-files-present-in-a-directory-in-node-j
  let i = 0;
  fs.readdirSync(IMPORT_MEDIA_PATH).forEach(async (file) => {
    i++;
    const filePath = path.resolve(__dirname, `${IMPORT_MEDIA_PATH}/${file}`);
    sleep(i * 500).then(async () => {
      console.log(`create: [${filePath}]`);
      if (fs.existsSync(filePath)) {
        // TODO: how import collection types
        const media = await payload.create<Media>({
          collection: 'media',
          data: {
            description: path.basename(file),
            // this is default
            // published: false,
          },
          filePath,
        });
        console.log(`[${i}] : imported ${file}: object: ${JSON.stringify(media)}`);
      }
    });
  });
}

start();
