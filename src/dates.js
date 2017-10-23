
let moment = require('moment');

export default {

  /**
   * The number of days since the last August 1st for the given date string (e.g. '2016-06-29').
   */
  dateToIntRelative(dateString) {
    let givenDate = moment(dateString);
    let august1st = givenDate.clone().startOf("year").add(7, "months");
    august1st.subtract(august1st.isAfter(givenDate) ? 1 : 0, "years");
    return givenDate.diff(august1st, "days");
  },

  findClosest(needle, haystack) {
    let target = this.dateToIntRelative(needle);
    let minDiff;
    let bestMatch;

    haystack.forEach(date => {
      let diff = Math.abs(this.dateToIntRelative(date) - target);
      if (minDiff === undefined || diff < minDiff) {
        minDiff = diff;
        bestMatch = date;
      }
    });

    return bestMatch;
  },


  /**
   * The number of days since the UNIX epoch for the given date string (e.g. '2016-06-29').
   */
  dateToInt(dateString) {
    let milliseconds = moment(dateString).valueOf();
    return Math.round(moment.duration(milliseconds).asDays());
  },

  /**
   * Produces the date string (e.g. '2016-06-29') for the given number of days since the UNIX epoch.
   */
  intToDate(int) {
    return moment(0).add(int, "days").format("YYYY-MM-DD");
  }
}