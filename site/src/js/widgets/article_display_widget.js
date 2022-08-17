import {Observable} from '../utils'

export default class ArticleDisplayWidget extends Observable {

    constructor(pageSize) {
        super();
        this.templateArticles = []
        this.pageSize = pageSize;
        
        this.prepareDOM();
    }

    prepareDOM() {
        this.elArticleLoadingWrapper = $('.articles-loading__wrapper');
        this.elArticleWrapper = $('.articles__wrapper')[0];
        const templateArticle = $('.article__wrap', this.elArticleWrapper)[0].cloneNode(true);

        $(this.elArticleWrapper).removeClass("hidden");
        $('.article__wrap', this.elArticleWrapper).remove();
        this.templateArticles = [...Array(this.pageSize)].map(() => {
            const elArticle = templateArticle.cloneNode(true);
            this.elArticleWrapper.append(elArticle);
            return elArticle;
        })

        this.elArticleLoadingWrapper.hide();
    }

    hideArticles() {
        this.templateArticles.forEach(el => {
            $(el).addClass("hidden");
        })
    }

    resetArticle(article) {
        $('.article-content__country', article).text("Country")
        $('.article-author', article).text("Author unavailable")
        $('.article-title', article).text("Title unavailable")
        $('.article-date', article).text("Date unavailable")
        $('.article-publisher', article).text("Publisher unavailable")
        $('.article-image', article).css('background-image', 'none');
    }

    displayArticles(pager) {
        this.hideArticles();

        let page = pager.page()

        page.forEach((el, idx) => {
            // let elArticleBlock = $(templateArticle.clone());
            let elArticleBlock = this.templateArticles[idx];
            this.resetArticle(elArticleBlock);

            $('.article-content__country', elArticleBlock).text(el.country)

            if (el.author)
                $('.article-author', elArticleBlock).text(el.author)

            if (el.title)
                $('.article-title', elArticleBlock).text(el.title)

            if (el.publish_date)
                $('.article-date', elArticleBlock).text(el.publish_date)

            if (el.publisher)
                $('.article-publisher', elArticleBlock).text(el.publisher)

            if (el.image)
                $('.article-image', elArticleBlock).css('background-image', `url(${el.image}`);

            $(elArticleBlock).attr('href', el.url);
            $(elArticleBlock).attr('target', "_blank");

            $(elArticleBlock).removeClass("hidden")
        })

        $(this.elArticleLoadingWrapper).addClass("hidden")
        $(this.elArticleWrapper).removeClass("hidden")
    }
}