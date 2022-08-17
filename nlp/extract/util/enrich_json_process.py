import pandas as pd
import json
from pandas.io.json import json_normalize

# convert the json output from text-razor to df
def json_to_df(filename):
    df_enriched = json_normalize(pd.Series(open(filename).readlines()).apply(json.loads))
    return df_enriched

# Unpack a json list column
# Column is the column to unpack; index_column is the identifier
def column_unpack(dataframe,column,index_column):
    df_single = dataframe[column].apply(lambda x: pd.Series(x)).stack().reset_index(level=1, drop=True).to_frame('new').join(dataframe[[index_column]], how='left')
    df_single.reset_index(inplace=True,drop=True)
    df_new=json_normalize(df_single['new'].tolist())
    df_new.reset_index(drop=True,inplace=True)
    result_df=pd.concat([df_new,df_single],axis=1)
    result_df.drop(columns='new',inplace=True)
    return  result_df

# Given a df converted from text-razor result
# Check if articles containing a certain topic
# if yes and the confidence score is over threshold write those into topic_exact column 
# write all topics of an article into a column, all_topics
def find_topic(df,keyword,threshold,index_column):
    dn_topic=column_unpack(df,'topics',index_column)  
    selected_urls=dn_topic[dn_topic['label'].str.contains(keyword,case=False)&(dn_topic['score']>=threshold)][index_column].unique()
    df_keyword=dn_topic[dn_topic[index_column].isin(selected_urls)]
    df_keyword.reset_index(inplace=True,drop=True)
    df_group=(df_keyword.groupby('url').label.apply(list).to_frame()
                        .assign(topics_exact = lambda x: x['label'].apply(lambda m: [i for i in m if keyword in i.lower()]))
                        .assign(topics_exact = lambda x: x['topics_exact'].apply(lambda i: list(set(i))))
                        .rename(columns={'label':'all_topics'})
        )
    df_group.reset_index(inplace=True)
    return df_group