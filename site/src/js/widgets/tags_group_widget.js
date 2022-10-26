import {Observable} from '../utils'

export default class TagsGroupWidget extends Observable {

    constructor() {
        super();
        this.tags= ["Water Sanitation","Water Supply","Water Security","Wastewater","Water Treatment","Natural Disaster","Urban Water","Waterborne Diseases","Rural Water","Water Pricing"];
        this.prepareDOM();
    }
    getTopic(tag_button){
        return tag_button.querySelector(".filter-button__label").innerText;
    }

    prepareDOM() {
        this.loadTags();
    }

    loadTags(){
        var tags_container=$("#filter-tags-group");
        
        this.tags.forEach(tag=>{
            tags_container.html(`${tags_container.html()} <a href="#" class="filter-button w-inline-block">
                                            <div class="filter-button__label">${tag}</div>
                                            <div class="filter-button__close">
                                            <div class="fa fa-times"></div>
                                            </div>
                                        </a>`);

        });

        const tag_buttons = document.querySelectorAll('.filter-button');
        tag_buttons.forEach( tag_button => {
                tag_button.addEventListener('click', e => {
                tag_buttons.forEach( btn => {
                    tag_button == btn ? 
                    tag_button.classList.toggle('active') : 
                    btn.classList.remove('active')
                });
                this.triggerEvent("tagsGroupWidget.change",{ tag:tag_button.classList.contains('active') ? this.getTopic(tag_button) : ""})
            });
        });
    }


}