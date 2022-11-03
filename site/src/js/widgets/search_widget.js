import {Observable} from '../utils'

const delay = 300;
let timer = null;

export default class SearchWidget extends Observable {
    constructor() {
        super();
        this.prepareDOM();
    }

    prepareDOM() {
        const elSearch = $('.search__bar');
        const self = this;
        elSearch.keyup(el => {
            const value = el.target.value;
            let query = null;
            let searchResults = null;

            if (value.length > 3) {
                query = value;
            }

            self.delayBeforeFiltering(query);
        })

    }

    delayBeforeFiltering(query) {
        if (timer != null) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => this.triggerEvent('searchwidget.search', query), delay);
    }
}