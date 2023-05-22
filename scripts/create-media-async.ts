import payload from "payload";
import path from 'path';
import fs from 'fs';

// run with `PAYLOAD_CONFIG_PATH=src/payload.config.ts npx ts-node scripts/create-media-async.ts`
// or create a script

// TODO: check if file exists and skip import it

require('dotenv').config();

interface ICategory {
  id: string;
  key: Category;
}

enum Category {
  documents = 'documents',
  hymns = 'hymns',
  videos = 'videos',
  audios = 'audios',
  images = 'images',
}

// const CURRENT_CATEGORY: Category = Category.audios;
const IMPORT_CATEGORIES = {
  documents: {
    id: '645431c6c537488fa543e33d',
    key: Category.documents,
  },
  hymns: {
    id: '646536992cfe3541c33058cf',
    key: Category.hymns,
  },
  images: {
    id: '64543104c537488fa543e283',
    key: Category.images,
  },
  audios: {
    id: '646536002cfe3541c3305866',
    key: Category.audios,
  },
  videos: {
    id: '6465368e2cfe3541c33058c7',
    key: Category.videos,
  },
};

const IMPORT_TAGS = [
  "645431d9c537488fa543e34c"
];

const { PAYLOAD_SECRET, MONGODB_URI } = process.env;
// const MEDIA_FOLDER = './media';
// const MEDIA_FOLDER_CATEGORY = `${MEDIA_FOLDER}/${CURRENT_CATEGORY}`;
const IGNORE_FILES = ['exclude.tag'];

const importMedia = async (category: ICategory) => {
  try {
    await payload.init({
      secret: String(PAYLOAD_SECRET),
      mongoURL: String(MONGODB_URI),
      // enables local mode, doesn't spin up a server or frontend
      local: true,
    });

    // create directory
    // if (!fs.existsSync(MEDIA_FOLDER_CATEGORY)) {
    //   fs.mkdirSync(MEDIA_FOLDER_CATEGORY);
    // }

    const importMediaFolder = `../mediaImport/batch01/${category.key}`;
    const importMediaPath = path.resolve(__dirname, importMediaFolder);

    const promises = Array<Promise<any>>();
    fs.readdirSync(importMediaPath).forEach(async (file) => {
      if (IGNORE_FILES.find(e => e !== file)) {
        const filePath = path.resolve(__dirname, `${importMediaPath}/${file}`);
        console.log(`import media file '${file}' from '${filePath}'`);
        const promise = payload.create({
          collection: 'media',
          data: {
            category: category.id,
            // tags: IMPORT_TAGS,
            description: path.basename(file),
          },
          filePath,
        });
        promises.push(promise);
      }
    });
    console.log('launch promises');
    await Promise.all(promises);
  } catch (error) {
    console.log('Unable to find media files');
    console.error(error);
    process.exit(0);
  }
  console.log('Import media files completed!');
  process.exit(0);
};

// const promises = Array<Promise<any>>();
// Object.keys(IMPORT_CATEGORIES).forEach(async (e) => {
//   const category: ICategory = IMPORT_CATEGORIES[e];
//   // console.log(`category: [${JSON.stringify(category, undefined, 2)}]`);
//   promises.push(importMedia(category));
// });

// async () => { await Promise.all(promises) };
// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
// sleep(30000);

// importMedia(IMPORT_CATEGORIES[Category.audios]);
// importMedia(IMPORT_CATEGORIES[Category.documents]);
// importMedia(IMPORT_CATEGORIES[Category.hymns]);
// importMedia(IMPORT_CATEGORIES[Category.images]);
importMedia(IMPORT_CATEGORIES[Category.videos]);