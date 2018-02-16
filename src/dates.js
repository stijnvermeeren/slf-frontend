
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

  fullFormat(dateString) {
    const date = moment(dateString);
    const dateFormat = date.format("D MMMM YYYY");
    const daysAgo = moment().startOf('day').diff(date, 'days');
    if (daysAgo === 0) {
      return dateFormat + ' (today)';
    } else if (daysAgo === 1) {
      return dateFormat + ' (yesterday)';
    } else if (daysAgo <= 7) {
      return dateFormat + ' (' + daysAgo + ' days ago)';
    } else {
      return dateFormat;
    }
  }
}
