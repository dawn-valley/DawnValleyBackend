import path from 'path';
import { buildConfig } from 'payload/config';
import Categories from './collections/Categories';
import Media from './collections/Media';
import Posts from './collections/Posts';
import Tags from './collections/Tags';
import Users from './collections/Users';

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
  },
  collections: [
    Categories,
    Posts,
    Tags,
    Users,
    Media,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts')
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  upload: {
    // save files with right encoding (utf8)
    defCharset: 'utf8',
    defParamCharset: 'utf8',
  },
  i18n: {
    fallbackLng: 'pt'
  },
});
