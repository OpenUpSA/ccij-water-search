import Pager from './pager';

export default class ArticleFilter {
    constructor(state, components) {
        this.state = state;
        this.components = components;
    }

    filterArticles(data) {

        const pagerWidget = this.components.pagerWidget;
        const articleDisplayWidget = this.components.articleDisplayWidget;
        const pageSize = this.components.pageSize;
        let state=this.state;

        state.pager = new Pager(data.articles, pageSize,data.numberOfPages);
        state.pager._currentPage=data.currentPage-1;
        pagerWidget.onPage(state.pager);
        state.pager.on("pager.previous", payload => pagerWidget.onPrevious(payload))
        state.pager.on("pager.next", payload => pagerWidget.onNext(payload))
        state.pager.on("pager.first", payload => pagerWidget.onFirst(payload))
        state.pager.on("pager.page", payload => pagerWidget.onPage(payload))

        articleDisplayWidget.displayArticles(state.pager);
    }
}
