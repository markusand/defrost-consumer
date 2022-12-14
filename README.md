# DeFROST raster extractor

Nodejs package to retrieve raster data from the [DeFROST API](https://docs.defrost.io/#defrost-api).

## Setup

Install Nodejs if not installed yet.

Install the package

```bash
clone https://github.com/markusand/defrost-consumer.git
cd defrost-consumer
npm install
```

Create a `.env` file with the API login credentials

```env
DEFROST_USER=
DEFROST_PSWD=
DEFROST_CATCHMENT= (optional, defaults to 'andorra')
```

Launch the script passing the desired date(s) as single parameters, a date range or a combination of both.

Provide an optional catchment if not already set up in environment variables. *Defaults to `andorra`*.

Provide an optional type of raster `sd`, `sce` or `swe`. *Defaults to `sd`*.

> **Notice all dates must follow the YYYY-MM-DD format**

```bash
node src/index.js 2022-01-06 2022-02-14 --catchment=andorra --type=sce

node src/index.js --from=2021-12-25 --until=2021-12-31

node src/index.js 2022-01-06 2022-02-14 --from=2021-12-25 --until=2021-12-31
```

Shorthand argument aliases are also available for convenience.

| argument | alias |
| --- | --- |
| --type=sd | -t sd |
| --catchment=andorra | -c andorra |
| --from=2022-01-01 | -f 2022-01-01 |
| --until=2022-01-06 | -u 2022-01-06 |

Am npm start script is available for convenience as well.

```bash
npm start -- --from=2022-01-01 --until=2022-01-06
```

**Notice the extra double dash `--` that MUST be included after the `npm start`.**

## Output

Rasters will be stored in their correspondent subdirectory inside the `images` directory. All rasters in `images` can always be deleted, but not the directories themselves neither the `.gitkeep` files in them.
