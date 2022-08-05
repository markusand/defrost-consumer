import dotenv from 'dotenv';
import minimist from 'minimist';
import defrost from './api.service.js';
import fs from './fs.service.js';
import date from './date.js';

dotenv.config();

const {
  DEFROST_USER,
  DEFROST_PSWD,
  DEFROST_CATCHMENT = 'andorra',
} = process.env;

(async () => {
  try {
    const {
      c = DEFROST_CATCHMENT,
      catchment = c,
      ...rest
    } = minimist(process.argv.slice(2));

    // Valid dates are required to prevent query the full API dataset
    const dates = date.fromArguments(rest);
    if (!dates.length) throw new Error('At least one date is required');

    // Authenticate the API
    const credentials = { username: DEFROST_USER, password: DEFROST_PSWD };
    await defrost.authenticate(credentials);

    // List asked rasters available in the API
    console.log(`Loading rasters for ${catchment}...`);
    const rasters = await defrost.getRastersList({ dates, catchment });
    if (!rasters.length) throw new Error('No rasters found for this dates');

    // Retrieve all rasters and save them as files
    const saved = rasters.map(async raster => {
      try {
        console.log(`· Loading ${raster.date}...`);
        const { pathname } = new URL(`../images/${raster.file_name}`, import.meta.url);
        const stream = await defrost.getRasterStream(raster.url);
        await fs.saveStream(pathname, stream);
        console.log('\x1b[32m', `Saved ${raster.date}`, '\x1b[0m');
      } catch (error) {
        console.log('\x1b[31m', `Raster for ${raster.date}: ${error.message}`, '\x1b[0m');
      }
    });

    // Wait until everything is saved
    await Promise.allSettled(saved);
    console.log('\n', '\x1b[42m', 'Done', '\x1b[0m \x1b[32m', 'Finished retrieving', '\x1b[0m');
  } catch (error) {
    console.error('\x1b[41m', 'Error', '\x1b[0m \x1b[31m', error.message, '\x1b[0m');
  }
})();
