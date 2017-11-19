
import moment from 'moment';

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

  findClosest(dateString, options) {
    let target = this.dateToIntRelative(dateString);
    let minDiff;
    let bestMatch;

    options.forEach(option => {
      let diff = Math.abs(this.dateToIntRelative(option.value) - target);
      if (minDiff === undefined || diff < minDiff) {
        minDiff = diff;
        bestMatch = option;
      }
    });

    return bestMatch;
  },

  fullFormat(dateString) {
    return moment(dateString).format("D MMMM YYYY");
  }
}