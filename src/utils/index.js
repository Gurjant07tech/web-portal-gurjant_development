import momentTimezone from "moment-timezone";

export const getOffsetsTz = () => {
  const timezones = momentTimezone.tz.names();

  let offsetTmz = [];

  for (let i in timezones) {
    offsetTmz.push(
      " (GMT" +
        momentTimezone.tz(timezones[i]).format("Z") +
        ") " +
        timezones[i]
    );
  }

  return offsetTmz;
};

export const getUserTz = () => {
  const tz = momentTimezone.tz.guess();
  return getOffsetsTz().find((offsetValue) => offsetValue.includes(tz));
};
