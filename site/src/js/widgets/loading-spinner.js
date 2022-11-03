import {Observable} from '../utils'

export default class LoadingSpinnerWidget extends Observable {

    constructor() {
        super();
        this.spinner=document.querySelector(".articles_loading_spinner__wrapper");
        this.hideSpinner();
    }
    showSpinner(){
        this.spinner.classList.remove("hide");
    }
    hideSpinner(){
        this.spinner.classList.add("hide");
    }


}