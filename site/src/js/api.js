
export default class Api{
    constructor(pageSize){
        this.pageSize=pageSize;
        this.articles_base_search_url="api/articles-search/";
        this.countries_url="api/countries/";
        this.date_range_url="api/articles-date-range/";
    }
    async getArticles(state){
        const queryParams={
            pageSize:this.pageSize
        }
        if (state.tag && state.tag!="") {
            queryParams.tag=state.tag;
        }
        if (state.query && state.query!=""){
            queryParams.query=state.query;
        }
        if (state.country){
            queryParams.country=state.country;
        }
        if (state.date_ranges) {
            queryParams.startDate=moment(state.date_ranges.start).unix();
            queryParams.endDate=moment(state.date_ranges.end).unix();
            
        }
        if (state.pager){
            queryParams["page"]=state.pager.currentPage;
        }
        

        let url = this.gerenerateUrlWithParams(queryParams);
        let data=null;
        await fetch(url).then(async res=>{
            data=await res.json();
        });
        return data;

    }

    async getCountries(){
        let countries=null;
        await fetch(this.countries_url).then(async(res)=>{
            countries=await res.json();
        });
        return countries;

    }

    async getDateRange(){
        let date_range=null;
        await fetch(this.date_range_url).then(async(res)=>{
            date_range=await res.json();
        });
        return date_range;

    }

    gerenerateUrlWithParams(queryParams){
        let params=[];
        let url=this.articles_base_search_url;
        for (const paramKey of Object.keys(queryParams)) {
            params.push(`${paramKey}=${queryParams[paramKey]}`)
        }
        if (params.length>=1) {
            url+=`?${params.join("&")}`;
        }
        return url;
    }
}