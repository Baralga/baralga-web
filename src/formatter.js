import moment from "moment/src/moment";

export const formatDuration = (duration) => {
  return (
    duration
      .hours()
      .toString()
      .padStart(2, "0") +
    ":" +
    duration
      .minutes()
      .toString()
      .padStart(2, "0")
  );
};

export const asFormattedDuration = (from, to) => {
  let duration = moment.duration(to.diff(from));
  return formatDuration(duration);
};