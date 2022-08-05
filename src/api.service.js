// import fs from 'fs';
import axios from 'axios';

const baseURL = 'https://api.defrost.io/v1';

const api = axios.create({ baseURL });

const authenticate = async credentials => {
  const { data } = await api.post('/token/', credentials);
  api.defaults.headers.common = { Authorization: `Bearer ${data.access}`}
};

const getRastersList = async (dates = []) => {
  const { data: rasters } = await api.get(`catchments/andorra/sd-rasters/`);
  return dates.length
    ? rasters.snowmaps.filter(raster => dates.includes(raster.date))
    : rasters.snowmaps;
};

const getRasterStream = async url => {
  const { data: stream } = await api.get(url, { responseType: 'stream' });
  return stream;
};

export default { api, authenticate, getRastersList, getRasterStream };
