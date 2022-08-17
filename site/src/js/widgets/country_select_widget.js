import {Observable} from '../utils'

export default class CountrySelectWidget extends Observable {

    constructor(data) {
        super();
        this.countries = this.extractCountries(data);
        this.prepareDOM();
    }

    extractCountries(data) {
        const countries = {}
        data.forEach(el => {
            countries[el.country] = 1
        })

        return Object.keys(countries).sort()
    }


    prepareDOM() {
        this.populateCountryDropdown(this.countries);
    }

    populateCountryDropdown(countries) {
        const elDropdownCountries = $('.dropdown-list__links');
        const templateDropdownLink = $('.dropdown-link', elDropdownCountries)[0].cloneNode(true);
        $('.dropdown-link', elDropdownCountries).remove();

        countries = ["All Countries"].concat(countries);

        countries.forEach(el => {
            let element = $(templateDropdownLink.cloneNode(true));
            element.removeClass('active');
            element.text(el)
            elDropdownCountries.append(element);

            element.click(ev => {
                $('.dropdown-link', elDropdownCountries).removeClass('active');
                $(ev.target).addClass('active');
                const country = ev.target.text;
                $(".selected_country").text(country)
                this.triggerEvent('countryselectwidget.select', country);
            })
        })
    }
}
