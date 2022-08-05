import {
  eachDayOfInterval,
  isBefore,
  isValid,
  parse,
} from 'date-fns';

// Validator
const VALID_DATE_FORMAT = 'yyyy-MM-dd';
const isDate = date => isValid(parse(date, VALID_DATE_FORMAT, new Date()));
const isRange = (from, until) => (!from && !until)
    || (isDate(from) && isDate(until) && isBefore(new Date(from), new Date(until)));

// fr-CA => yyyy-MM-dd
const dateFormatter = Intl.DateTimeFormat('fr-CA');
const formatDate = date => dateFormatter.format(new Date(date));

// Parse dates from arguments
const fromArguments = ({ _: dates, from, until }) => {
  const invalidDate = dates.find(date => !isDate(date));
  if (invalidDate) throw new Error(`${invalidDate} is an invalid date`);
  if (!isRange(from, until)) throw new Error(`from ${from} until ${until} is an invalid range`);
  const range = from && until
    ? eachDayOfInterval({ start: new Date(from), end: new Date(until) })
    : [];
  return [...dates, ...range.map(formatDate)];
};

export default { fromArguments };
