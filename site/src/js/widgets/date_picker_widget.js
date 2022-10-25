import {Observable} from '../utils'

export default class DateRangePickerWidget extends Observable {

    constructor(data) {
        super();
        this.dates=this.extractDates(data);
        this.prepareDOM();
    }

    extractDates(data) {
        const dates = {}
        //TODO:extract all dates
        return dates
    }


    prepareDOM() {
        this.setupWidget();
    }

    setupWidget() {
        $('#date-range-filter').daterangepicker({
            ranges:{
              'Today': [moment(), moment()],
              'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
              'Last 7 Days': [moment().subtract(6, 'days'), moment()],
              'Last 30 Days': [moment().subtract(29, 'days'), moment()],
              'This Month': [moment().startOf('month'), moment().endOf('month')],
              'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            },
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
            opens:"right",
            drops:"down",
            autoUpdateInput:true,
            linkedCalendars:false,
            showDropdowns:true,
            alwaysShowCalendars:true,
            showCustomRangeLabel:true
            }, 
            function(start, end, label) { 
              //TODO: trigger date range change event
              console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')'); 
            }
              );
        $('#date-range-filter').val("Pick a date");

    }
}