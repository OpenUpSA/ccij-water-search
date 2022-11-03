'use strict';

var lunr=require("lunr");
var moment=require("moment");
var data=require("../../src/data/africa_db.json");
exports.handler=async function(event, context, callback){
    var idx = lunr(function () {
        this.ref('id');
        this.field('summary');
        this.field('title');

        data.forEach(function (doc, pos) {
            doc.id = pos;
            this.add(doc);
        }, this);
    });
    var articles=data;

    //filter by query
    if (event.queryStringParameters.query!==null && event.queryStringParameters.query!==undefined) {
        articles=idx.search(event.queryStringParameters.query);
        articles= articles.map(el => {
            const id = el.ref;
            return data[id];
        });
    } 

    //filter by country
    let country=event.queryStringParameters.country;
    if (country!==null && country!==undefined) {
        
        articles = articles.filter(el => {
            if (country && country != 'All Countries') {
                if (el.country == country)
                    return true;
                return false;
            }
            return true;
        });
    }

    //filter by dates
    let startDate=event.queryStringParameters.startDate;
    let endDate=event.queryStringParameters.endDate;

    if ((startDate!==null && startDate!==undefined) && (endDate!==null && endDate!==undefined) ) {
        startDate=moment.unix(startDate);
        endDate=moment.unix(endDate);
        articles = articles.filter((article)=> {
            if(!article?.publish_date) return false;

            return moment(article.publish_date).isSameOrAfter(startDate) && moment(article.publish_date).isSameOrBefore(endDate);
        });
    }

    //filter by tag
    let tag=event.queryStringParameters.tag;
    if (tag!==null && tag!==undefined) {
        articles = articles.filter((article)=> {
            return article.tags.includes(tag);
        });
    }

    //get articles in page
    const pageSize=event.queryStringParameters.pageSize;
    const page=event.queryStringParameters.page;
    const pager=new Pager(data=articles);
    if (pageSize!==null && pageSize!==undefined){
        pager.pageSize=pageSize;
    }
    let articlesInPage=pager.first();
    if (page && page<=pager.numPages) {
        articlesInPage=pager.toPage(page);
    }
    

    return {
        statusCode:200,
        body:JSON.stringify({
            currentPage:pager.currentPage,
            numberOfPages:pager.numPages,
            numberOfArticles:articles.length,
            isFirstPage:pager.isFirst,
            isLastPage:pager.isLast,
            articles:articlesInPage,

        })
    }

};

class Pager {
    constructor(data, pageSize = 30) {
        this.data = data;
        this.pageSize = pageSize;
        this._currentPage = 0;
    }

    getPage(pageNo) {
        const index = this.pageIndexes(pageNo);
        return this.data.slice(index.start, index.end);
    }

    page() {
        return this.getPage(this._currentPage);
    }

    first() {
        this._currentPage = 0;
        return this.page();
    }

    toPage(page) {
        if (page!==null && page !==undefined) {
            this._currentPage = page - 1;
        }
        return this.page();
    }

    get numPages() {
        return Math.ceil(this.data.length / this.pageSize)
    }

    get currentPage() {
        return this._currentPage + 1;
    }

    get isFirst() {
        return this.currentPage == 1;
    }

    get isLast() {
        return this.currentPage == this.numPages;
    }

    pageIndexes(pageNo) {
        const startIdx = pageNo * this.pageSize;
        const endIdx = (pageNo + 1) * this.pageSize;

        return {
            start: startIdx,
            end: endIdx
        }
    }
}
