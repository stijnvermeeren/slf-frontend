
import moment from 'moment';

export default {

  /**
   * The number of days since the last August 1st for the given date string (e.g. '2016-06-29').
   */
  dateToIntRelative(dateString) {
    const givenDate = moment(dateString);
    const august1st = givenDate.clone().startOf("year").add(7, "months");
    august1st.subtract(august1st.isAfter(givenDate) ? 1 : 0, "years");
    return givenDate.diff(august1st, "days");
  },

  findClosest(dateString, options) {
    const target = this.dateToIntRelative(dateString);
    let minDiff;
    let bestMatch;

    options.forEach(option => {
      const diff = Math.abs(this.dateToIntRelative(option) - target);
      if (minDiff === undefined || diff < minDiff) {
        minDiff = diff;
        bestMatch = option;
      }
    });

    return bestMatch;
  },

  fullFormat(date) {
    const momentDate = moment(date).startOf("day");
    const dateFormat = momentDate.format("D MMMM YYYY");
    const daysAgo = moment().startOf('day').diff(momentDate, 'days');
    if (daysAgo === 0) {
      return dateFormat + ' (today)';
    } else {
      return dateFormat;
    }
  },

  year(dateString) {
    const givenDate = moment(dateString);
    const august1st = givenDate.clone().startOf("year").add(7, "months");
    return august1st.isAfter(givenDate) ? august1st.get("year") : august1st.get("year") + 1;
  },

  dateToIso(date) {
    return date.toISOString().substr(0,10);
  },

  equals(date1, date2) {
    return this.dateToIso(date1) === this.dateToIso(date2);
  }
}
