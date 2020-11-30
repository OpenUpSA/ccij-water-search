import json
import requests
import pandas as pd
from pandas.io.json import json_normalize
import numpy as np

# construct google api search urls
# return a list of request urls, recent num months

# multiple keywords search format: water\ pollution\ news
# country restriction:  &cr=Nigeria      
# search from a particular website: &siteSearch='+site+'&siteSearchFilter=i
# template
# https://www.googleapis.com/customsearch/v1?q={searchTerms}&num={count?}&start={startIndex?}&lr={language?}&safe={safe?}&cx={cx?}&sort={sort?}&filter={filter?}&gl={gl?}&cr={cr?}&googlehost={googleHost?}&c2coff={disableCnTwTranslation?}&hq={hq?}&hl={hl?}&siteSearch={siteSearch?}&siteSearchFilter={siteSearchFilter?}&exactTerms={exactTerms?}&excludeTerms={excludeTerms?}&linkSite={linkSite?}&orTerms={orTerms?}&relatedSite={relatedSite?}&dateRestrict={dateRestrict?}&lowRange={lowRange?}&highRange={highRange?}&searchType={searchType}&fileType={fileType?}&rights={rights?}&imgSize={imgSize?}&imgType={imgType?}&imgColorType={imgColorType?}&imgDominantColor={imgDominantColor?}&alt=json"

def get_urls(keyword, num, country='?', site='all'):
    baseurls=[]
    additional_res=''
    if site!='all':
        additional_res+='&siteSearch='+site+'&siteSearchFilter=i'
    #  key is my charged key
    for i in range(0,num):
        baseurls.append('https://www.googleapis.com/customsearch/v1?key=?&cx=8689776d4e95967fb&q='+keyword+'&dateRestrict=m'+str(i)+'&filter=1&sort=date:a&cr='+country+additional_res)
    return baseurls


# Give one url get all returned results
# for each contructed url, there are 10 pages of results, add page turning
def get_data(baseurl):
    data=[]
    for i in range(0,10):
        realurl=baseurl+'&start='+str(i*10+1)
        data.append(requests.get(realurl).text)
    return data


# return by key from json object
def find(o,col):
    try:
        res=o[0][col]
        return res
    except:
        return np.nan


# given returned data, get useful information
def data_process(data):
    results=[]
    failed_urls=[]
    for i in data:
    # get search records results from returned json
        try:
            result=json.loads(i)['items']
            results.append(result)
        except:
            failed_urls.append(i)
            
    #flatten result list into one list result_l
    result_l=[]
    for sub_l in results:
        for i in sub_l:
            result_l.append(i)
            
    #write everything into a dataframe
    df_draft=json_normalize(result_l)
    df_draft['keywords']=df_draft['pagemap.metatags'].apply(lambda x:find(x,"news_keywords"))
    df_draft['description']=df_draft['pagemap.metatags'].apply(lambda x:find(x,'og:description'))
    df_draft['date']=df_draft['pagemap.metatags'].apply(lambda x:find(x,"article:published_time"))
    df_draft['tag']=df_draft['pagemap.metatags'].apply(lambda x:find(x,"article:tag"))
    df_draft['twitter_desc']=df_draft['pagemap.metatags'].apply(lambda x:find(x,"twitter:description"))
    df_draft.rename(columns={'link':'url'},inplace=True)
    #Get only useful columns
    df=df_draft.loc[:,['title','url','keywords','description','date','tag','twitter_desc']]
    return df


# Given an url list return a dataframe of useful information 
# with article summary, date, author, keywords, etc.
def alldata(url_list):
    df=pd.DataFrame()
    for i in url_list:
    # a list of data requests from 10 pages
        data=get_data(i)
    # process json into dataframe temp_df
        temp_df=data_process(data)
    # all temp_df concat together to get all data from urllist
        df=pd.concat([df,temp_df])
    df.drop_duplicates(inplace=True)
    df.reset_index(drop=True,inplace=True)
    return df
