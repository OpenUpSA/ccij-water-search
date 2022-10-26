import data from '../data/africa_db.json'
import lottie from '../documents/lottieflow-scrolling-05-2-66aaf8-easey.json';

import PagerWidget from './widgets/pager_widget';
import SearchWidget from './widgets/search_widget';
import CountrySelectWidget from './widgets/country_select_widget';
import ArticleDisplayWidget from './widgets/article_display_widget';
import FeedbackWidget from './widgets/feedback_widget';
import DateRangePickerWidget from './widgets/date_picker_widget';

import Analytics from './analytics';
import Search from './search';
import ArticleFilter from './article_filter';

const pageSize = 18;

const state = {
    country: null,
    date_ranges: null,
    pager: null,
    query: "",
    tag: "",
}

const analytics = new Analytics('UA-44046318-6');
const searchEngine = new Search(data);
const pagerWidget = new PagerWidget();
const searchWidget = new SearchWidget();
const countrySelectWidget = new CountrySelectWidget(data);
const feedbackWidget = new FeedbackWidget();
const articleDisplayWidget = new ArticleDisplayWidget(pageSize);
const dateRangePickerWidget = new DateRangePickerWidget(data);

const articleFilter = new ArticleFilter(state, data, {
    pagerWidget: pagerWidget,
    searchEngine: searchEngine,
    articleDisplayWidget: articleDisplayWidget,
    pageSize: pageSize
})

pagerWidget.on('pagerwidget.previous', payload => {
    if (state.pager) {
        state.pager.previous()
        articleDisplayWidget.displayArticles(state.pager);
    }
})

pagerWidget.on('pagerwidget.next', payload => {
    if (state.pager) {
        state.pager.next()
        articleDisplayWidget.displayArticles(state.pager);
    }
})

pagerWidget.on('pagerwidget.page', payload => {
    if (state.pager) {
        state.pager.toPage(payload)
        articleDisplayWidget.displayArticles(state.pager);
    }
})

searchWidget.on('searchwidget.search', payload => {
    state.query = payload;
    articleFilter.filterArticles();
})

countrySelectWidget.on('countryselectwidget.select', payload => {
    state.country = payload;
    articleFilter.filterArticles();
})

dateRangePickerWidget.on("dateRangePickerWidget.rangeChange", payload => {
    state.date_ranges = payload
    articleFilter.filterArticles();
})

document.querySelector("#cancel-date-range").addEventListener("click", () => {
    state.date_ranges = null
    dateRangePickerWidget.resetRange()
    articleFilter.filterArticles();
})

// tags

function getTopic(button){
    return button.querySelector(".filter-button__label").innerText
}

const buttons = document.querySelectorAll('.filter-button')

buttons.forEach(button => {
    button.addEventListener('click', function(){
        buttons.forEach(btn => {
            button == btn ? 
            button.classList.toggle('active') : 
            btn.classList.remove('active')
        })

        state.tag = button.classList.contains('active') ? getTopic(button) : "" 

        articleFilter.filterArticles()
    });
});

pagerWidget.on('pagerwidget.previous', payload => analytics.logEvent('search', 'pagerwidget.previous'))
pagerWidget.on('pagerwidget.next', payload => analytics.logEvent('search', 'pagerwidget.next'))
pagerWidget.on('pagerwidget.page', payload => analytics.logEvent('search', 'pagerwidget.page'))
searchWidget.on('searchwidget.search', payload => analytics.logEvent('search', 'searchwidget.search', payload))
countrySelectWidget.on('countryselectwidget.select', payload => analytics.logEvent('search', 'countryselectwidget.select', payload))
feedbackWidget.on('feedbackwidget.thumbsdown', payload => analytics.logEvent('feedback', 'feedbackwidget.thumbsdown'))
feedbackWidget.on('feedbackwidget.thumbsup', payload => analytics.logEvent('feedback', 'feedbackwidget.thumbsup'))
feedbackWidget.on('feedbackwidget.dismiss', payload => analytics.logEvent('feedback', 'feedbackwidget.dismiss'))
//TODO: Analytics for date range picker

articleFilter.filterArticles();
