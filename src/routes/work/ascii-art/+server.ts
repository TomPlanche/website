/**
 * @file src/routes/work/ascii-art/+server.ts
 * @description +server
 * @author Tom Planche
 */

import {json} from '@sveltejs/kit';
import type {RequestHandler} from './$types';
import fs from 'fs';
import path from 'path';

export const GET: RequestHandler = async () => {
  const staticFolderPath = path.join(process.cwd(), 'static', '/ascii-art-assets/');

  try {
    const _files = await fs.promises.readdir(staticFolderPath);


    const files: {
      name: string;
      link: string
    }[] = _files.filter(file => !file.startsWith('.')).map(file => ({
      name: file,
      link: `/ascii-art-assets/${file}`
    }));


    return json({files});
  } catch (error) {
    console.error('Error reading directory:', error);

    return json({error: 'Failed to read directory'}, {status: 500});
  }
};

/**
 * End of file src/routes/work/ascii-art/+server.ts
 */