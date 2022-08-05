import fs from 'fs';

const saveStream = async (pathname, stream) => new Promise((resolve, reject) => {
  const writer = fs.createWriteStream(pathname);
  stream.pipe(writer);
  writer.on('finish', resolve);
  writer.on('error', reject);
});

export default { saveStream };
