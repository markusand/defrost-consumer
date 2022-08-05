import dotenv from 'dotenv';
import defrost from './api.service.js';
import fs from './fs.service.js';

dotenv.config();

const dates = ['2022-04-18'];

const { DEFROST_USER, DEFROST_PSWD } = process.env;

(async () => {
  try {
    // Authenticate the API
    const credentials = { username: DEFROST_USER, password: DEFROST_PSWD };
    await defrost.authenticate(credentials);
    console.log('· Logged successfuly');

    // List asked rasters available in the API 
    const rasters = await defrost.getRastersList(dates);

    // Retrieve all rasters and save them as files
    const saved = rasters.map(async raster => {
      try {
        console.log(`· Loading ${raster.date}...`);
        const { pathname } = new URL(`../images/${raster.file_name}`, import.meta.url);
        const stream = await defrost.getRasterStream(raster.url);
        await fs.saveStream(pathname, stream);
        console.log(`· Saved ${raster.date}`);
      } catch (error) {
        console.log(`[x] Error with ${raster.date}: `, error.response.data.message);
        return Promise.reject(error);
      }
    });

    // Wait until everything is saved
    await Promise.allSettled(saved);
    console.log('· Finished retrieving rasters');
  } catch(error) {
    console.error(`[x] ${error.message}`);
  }
})();
