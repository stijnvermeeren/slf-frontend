
export default {
  monthName(monthIndex) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return monthNames[monthIndex];
  },

  fullFormat(date) {
    const dateFormat = `${date.getDate()} ${this.monthName(date.getMonth())} ${date.getFullYear()}`;
    if (this.equals(date, new Date())) {
      return dateFormat + ' (today)';
    } else {
      return dateFormat;
    }
  },

  dateToIso(date) {
    return date.toISOString().substr(0,10);
  },

  equals(date1, date2) {
    return this.dateToIso(date1) === this.dateToIso(date2);
  }
}
