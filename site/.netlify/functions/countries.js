'use strict';

var data=require("../../src/data/africa_db.json");
exports.handler=async function(){
    const countries = {};
    data.forEach(el => {
        countries[el.country] = 1;
    });
    return {
        statusCode:200,
        body:JSON.stringify(Object.keys(countries).sort())
    }

};
