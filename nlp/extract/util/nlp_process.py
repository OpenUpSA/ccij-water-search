import spacy
import pandas as pd
import numpy as np


# Given tokens, find sentences containing a keyword from texts
def find_sents(tokens,keyword):
    useful_sents=[]
    for sent in tokens.sents:
        bows=[token.text for token in sent]
        for word in bows:
            if ((keyword in word.lower()) & (sent not in useful_sents)):
                useful_sents.append(sent)
    return useful_sents


# Given tokens and a keyword, get the dependency of this keyword in sentences
def get_dependency(tokens,keyword):
    dependency={'lefts':[],'rights':[],'head':[]}
    for token in tokens:
        if token.text==keyword:
            if len([t.text for t in token.lefts])>0:
                dependency['lefts'].append([t.text for t in token.lefts])
            if len([t.text for t in token.rights])>0:
                dependency['rights'].append([t.text for t in token.rights])
            dependency['head'].append(token.head.text)
    return dependency


# Given a df of news articles with texts,
# Get tokens with nlp
# Get sentences with a certain keyword in the text
# Get dependency of the keyword in the sentences containing the keyword
def process(df,keyword,txt_col):
    nlp = spacy.load('en_core_web_sm')
#   nlp processing get token from text
    df=df[~df[txt_col].isna()]
    df.loc[:,'nlp_t']=df.loc[:,txt_col].apply(lambda i: nlp(i))
   
    # Write sentences with keyword in the keyword column
    df.loc[:,keyword]=df.loc[:,'nlp_t'].apply(lambda x: find_sents(x,keyword))
    # if there is no sentence containing the keyword in the article, return nan
    df.loc[df[keyword].apply(lambda x: len(x)==0),keyword]=np.nan

    # Write dependence component in the dependency column
    df.loc[:,'dependence']=df.loc[:,'nlp_t'].apply(lambda i: get_dependency(i,keyword))
    df.reset_index(inplace=True,drop=True)
    return df