'use strict';

var moment=require("moment");
var data=require("../../src/data/africa_db.json");
exports.handler=async function(event, context, callback){

    const dates=getDateRange(data);
    return {
        statusCode:200,
        body:JSON.stringify(dates)
    }

};
  
  
/**
 * 
 * @param {[]} data 
 */
function filterArticlesWithNullPublishDate(data){
  return data.filter((article)=> !!article.publish_date);
}

/**
* 
* @param {[]} data 
*/
function sortArticlesByIncreasingDate(data){
  return data.sort((a,b)=> {
      return moment(a.publish_date).isBefore(b.publish_date)? -1: 1;
  })
}
/**
* 
* @param {[]} data 
*/
function extractDates(data) {
  const articlesWithDates = filterArticlesWithNullPublishDate(data);
  const sortedArticles = sortArticlesByIncreasingDate(articlesWithDates);
  const dates=new Set(sortedArticles.map(dt => dt.publish_date));
  return Array.from(dates);
}

function getDateRange(data){
  let dates=extractDates(data);
  return [dates[0], dates[dates.length - 1]];
}
