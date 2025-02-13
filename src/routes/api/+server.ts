/**
 * @file src/routes/api/+server.ts
 * @description +server
 * @author Tom Planche
 */
import {json} from '@sveltejs/kit';
import type {RequestHandler} from './$types';
import {PUBLIC_BACK_ENDPOINT} from '$env/static/public';
import axios from 'axios';


export const GET: RequestHandler = async () => {
  const response = await axios.get(`${PUBLIC_BACK_ENDPOINT}/`);

  return json(response.data);
};

/**
 * End of file src/routes/api/+server.ts
 */