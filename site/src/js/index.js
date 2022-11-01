import PagerWidget from './widgets/pager_widget';
import SearchWidget from './widgets/search_widget';
import CountrySelectWidget from './widgets/country_select_widget';
import ArticleDisplayWidget from './widgets/article_display_widget';
import FeedbackWidget from './widgets/feedback_widget';
import DateRangePickerWidget from './widgets/date_picker_widget';
import TagsGroupWidget from './widgets/tags_group_widget';
import 'regenerator-runtime/runtime';
import Analytics from './analytics';
import ArticleFilter from './article_filter';

import Api from './api';

const pageSize = 18;

const state = {
    country: null,
    date_ranges: null,
    pager: null,
    query: "",
    tag: "",
}
const api=new Api(pageSize);
const analytics = new Analytics('UA-44046318-6');
const pagerWidget = new PagerWidget();
const searchWidget = new SearchWidget();

var countrySelectWidget = null;
const feedbackWidget = new FeedbackWidget();
const articleDisplayWidget = new ArticleDisplayWidget(pageSize);
var dateRangePickerWidget = null;
const tagsGroupWidget = new TagsGroupWidget(state);

const articleFilter = new ArticleFilter(state, {
    pagerWidget: pagerWidget,
    articleDisplayWidget: articleDisplayWidget,
    pageSize: pageSize
})

pagerWidget.on('pagerwidget.previous', async payload => {
    if (state.pager) {
        state.pager.previous()
        await api.getArticles(state).then(res=>{
            state.pager.data=res.articles;
            articleDisplayWidget.displayArticles(state.pager); 
        });
    }
})

pagerWidget.on('pagerwidget.next', async payload => {
    if (state.pager) {
        state.pager.next()
        await api.getArticles(state).then(res=>{
            state.pager.data=res.articles;
            articleDisplayWidget.displayArticles(state.pager); 
        });
    }
})

pagerWidget.on('pagerwidget.page', async payload => {
    if (state.pager) {
        state.pager.toPage(payload)
        await api.getArticles(state).then(res=>{
            state.pager.data=res.articles;
            articleDisplayWidget.displayArticles(state.pager); 
        });
    }
})

searchWidget.on('searchwidget.search', async payload => {
    state.query = payload;
    await api.getArticles(state).then(res=>{
        articleFilter.filterArticles(res); 
    });
})


tagsGroupWidget.on("tagsGroupWidget.change", async payload => {
    state.tag=payload.tag;
    await api.getArticles(state).then(res=>{
        articleFilter.filterArticles(res); 
    });

});

fetchCountries().then(()=>{
    countrySelectWidget.on('countryselectwidget.select', async payload => {
        state.country = payload;
        await api.getArticles(state).then(res=>{
            articleFilter.filterArticles(res); 
        });
        
    })
    countrySelectWidget.on('countryselectwidget.select', payload => analytics.logEvent('search', 'countryselectwidget.select', payload))


});

fetchDateRange().then(()=>{
    dateRangePickerWidget.on("dateRangePickerWidget.rangeChange", async payload => {
        state.date_ranges = payload;
        await api.getArticles(state).then(res=>{
            articleFilter.filterArticles(res); 
        });
    })
    dateRangePickerWidget.on("dateRangePickerWidget.clearChange", async payload=>{
        state.date_ranges = null
        dateRangePickerWidget.resetRange();
        await api.getArticles(state).then(res=>{
            articleFilter.filterArticles(res); 
        });
    });


});

pagerWidget.on('pagerwidget.previous', payload => analytics.logEvent('search', 'pagerwidget.previous'))
pagerWidget.on('pagerwidget.next', payload => analytics.logEvent('search', 'pagerwidget.next'))
pagerWidget.on('pagerwidget.page', payload => analytics.logEvent('search', 'pagerwidget.page'))
searchWidget.on('searchwidget.search', payload => analytics.logEvent('search', 'searchwidget.search', payload))
feedbackWidget.on('feedbackwidget.thumbsdown', payload => analytics.logEvent('feedback', 'feedbackwidget.thumbsdown'))
feedbackWidget.on('feedbackwidget.thumbsup', payload => analytics.logEvent('feedback', 'feedbackwidget.thumbsup'))
feedbackWidget.on('feedbackwidget.dismiss', payload => analytics.logEvent('feedback', 'feedbackwidget.dismiss'))
//TODO: Analytics for date range picker

async function fetchData(){
    await api.getArticles(state).then(res=>{
        articleFilter.filterArticles(res); 
    });
}

async function fetchCountries(){
    await api.getCountries().then((countries)=>{
        countrySelectWidget=new CountrySelectWidget(countries);
    });
}

async function fetchDateRange(){
    await api.getDateRange().then((date_range)=>{
        dateRangePickerWidget = new DateRangePickerWidget(date_range);
    });
}

fetchData();
