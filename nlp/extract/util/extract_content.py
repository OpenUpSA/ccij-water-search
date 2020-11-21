# extract tile, summary, text, date, author and keywords providing a list of urls

from newspaper import Article 
import pandas as pd

def extract_news(url):
    toi_article = Article(url, language="en") # en for English 
    try:
        toi_article.download() 
        toi_article.parse() 
        toi_article.nlp() 
        title= toi_article.title
        txt=toi_article.text
        summary=toi_article.summary
        keywords=toi_article.keywords
        authors=toi_article.authors
        date=toi_article.publish_date
        return [url,title,txt,summary,date,authors,keywords]
    except: 
        return [url]

def get_content(urls):
    # extract content from single news article
    df=pd.DataFrame(columns=['url','title','text','summary','date','author','keywords'])
    failed_url=[]
    for url in urls:
        result=extract_news(url)
        if len(result)>1:
            i=urls.index(url)
            df.loc[i] = extract_news(url)
        else:
            failed_url.append(url)
    return [df,failed_url]