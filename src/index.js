import dotenv from 'dotenv';
import minimist from 'minimist';
import { eachDayOfInterval, isBefore, isValid } from 'date-fns';
import defrost from './api.service.js';
import fs from './fs.service.js';

dotenv.config();

const { DEFROST_USER, DEFROST_PSWD } = process.env;

// Date validators
const dateFormatter = Intl.DateTimeFormat('fr-CA');
const formatDate = date => dateFormatter.format(new Date(date));
const isDate = date => isValid(new Date(date));

(async () => {
  try {
    // Parse dates from arguments
    const { _: singleDates, from, until } = minimist(process.argv.slice(2));
    const datesRange = from && until && isBefore(new Date(from), new Date(until))
      ? eachDayOfInterval({ start: new Date(from), end: new Date(until) })
      : [];
    const dates = [...singleDates.filter(isDate).map(formatDate), ...datesRange.map(formatDate)];

    if (!dates.length) throw new Error('Some dates are invalid');

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
      }
    });

    // Wait until everything is saved
    await Promise.allSettled(saved);
    console.log('· Finished retrieving rasters');
  } catch (error) {
    console.error(`[x] ${error.message}`);
  }
})();
