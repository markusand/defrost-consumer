import {
  eachDayOfInterval,
  isBefore,
  isValid,
} from 'date-fns';

const isDate = date => isValid(new Date(date));

// fr-CA => yyyy-MM-dd
const dateFormatter = Intl.DateTimeFormat('fr-CA');
const formatDate = date => dateFormatter.format(new Date(date));

// Parse dates from arguments
const fromArguments = ({ _: dates, from, until }) => {
  const datesRange = from && until && isBefore(new Date(from), new Date(until))
    ? eachDayOfInterval({ start: new Date(from), end: new Date(until) })
    : [];
  return [
    ...dates.filter(isDate).map(formatDate),
    ...datesRange.map(formatDate),
  ];
};

export default { fromArguments };
