import Pager from './pager';

export default class ArticleFilter {
    constructor(state, data, components) {
        this.data = data;
        this.state = state;
        this.components = components;
    }

    filterArticles() {
        let articles = this.data;
        const state = this.state;
        const pagerWidget = this.components.pagerWidget;
        const articleDisplayWidget = this.components.articleDisplayWidget;
        const searchEngine = this.components.searchEngine;
        const pageSize = this.components.pageSize;

        if (state.query != null) {
            const searchResults = searchEngine.search(state.query);
            articles = searchResults.map(el => {
                const id = el.ref;
                return this.data[id]
            })
        }

        articles = articles.filter(el => {
            if (state.country && state.country != 'All Countries') {
                if (el.country == state.country)
                    return true;
                return false
            }
            return true;
        })

        state.pager = new Pager(articles, pageSize);
        state.pager.on("pager.previous", payload => pagerWidget.onPrevious(payload))
        state.pager.on("pager.next", payload => pagerWidget.onNext(payload))
        state.pager.on("pager.first", payload => pagerWidget.onFirst(payload))
        state.pager.on("pager.page", payload => pagerWidget.onPage(payload))

        state.pager.first()

        articleDisplayWidget.displayArticles(state.pager);
    }
}
