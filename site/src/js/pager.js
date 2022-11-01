import {Observable} from './utils'

export default class Pager extends Observable {
    constructor(data, pageSize = 30, numPages) {
        super();
        this.data = data;
        this.pageSize = pageSize;
        this.numPages=numPages;
        this._currentPage = 0;
    }

    page() {
        return this.data;
    }

    first() {
        this._currentPage = 0;
        this.triggerEvent('pager.first', this)
    }

    next() {
        if (this._currentPage < this.numPages - 1) {
            this._currentPage += 1;
            this.triggerEvent('pager.next', this)
        }
    }

    previous() {
        this._currentPage -= 1;
        if (this._currentPage < 0)
            this._currentPage = 0;

        this.triggerEvent('pager.previous', this)
    }

    toPage(page) {
        this._currentPage = page - 1;
        this.triggerEvent('pager.page', this)
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
}