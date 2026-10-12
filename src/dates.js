
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  equals(date1, date2) {
    return this.dateToIso(date1) === this.dateToIso(date2);
  }
}
