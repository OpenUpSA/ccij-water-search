import {Observable} from '../utils'

export default class DateRangePickerWidget extends Observable {

  /**
   * 
   * @param {[]} data 
   */
    constructor(data) {
        super();
        this.dates= this.extractDates(data);
        this.prepareDOM();
    }

  /**
   * 
   * @param {[]} data 
   */
  #filterArticlesWithNullPublishDate(data){
    return data.filter((article)=> !!article.publish_date)
  }

  /**
  * 
  * @param {[]} data 
  */
  #sortArticlesByIncreasingDate(data){
    return data.sort((a,b)=> {
        return moment(a.publish_date).isBefore(b.publish_date)? -1: 1
    })
  }
  /**
  * 
  * @param {[]} data 
  */
  extractDates(data) {
    const articlesWithDates = this.#filterArticlesWithNullPublishDate(data)
    const sortedArticles = this.#sortArticlesByIncreasingDate(articlesWithDates)

    return sortedArticles.map(dt => dt.publish_date)
  }

  getDateRange(){
    return [this.dates[0], this.dates[this.dates.length - 1]]
  }

  prepareDOM() {
    this.setupWidget();
  }

  resetRange(){
    $('#date-range-filter').val("Pick a date");
  }

  setupWidget() {
    const [first, last] = this.getDateRange()

    $('#date-range-filter').daterangepicker({
        alwaysShowCalendars: true,
        autoUpdateInput: true,
        drops: "down",
        endDate: moment(last).format('MM/DD/YYYY'),
        linkedCalendars: false,
        locale:{
          direction: 'rtl',
            format: 'MM/DD/YYYY',
            separator: ' - ',
            applyLabel: 'Apply',
            cancelLabel: 'Cancel',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1      
        },
        maxYear: moment(last).year(),
        minYear: moment(first).year(),
        opens: "right",
        ranges: {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        },
        showDropdowns: true,
        showCustomRangeLabel: true,
        startDate: moment(last).subtract(1, "month").format('MM/DD/YYYY'),
      }, 
      (start, end, label) => {
        this.triggerEvent("dateRangePickerWidget.rangeChange",{ start: moment(start).toDate(), end: moment(end).toDate()})
      }
    );
    $("#cancel-date-range").on("click", () => {
        this.triggerEvent("dateRangePickerWidget.clearChange",{});
    });

    this.resetRange()
  }
}