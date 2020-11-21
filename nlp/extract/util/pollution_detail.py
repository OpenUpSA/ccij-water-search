import pandas as pd


# get the Pollutants， disease and place information from entity df
species=['Escherichia coli', 'Algae', 'Bacteria' ,'Enterococcus','Coral', 'Cladocera','Nitrosomonas', 'Nitrobacter','Green algae','Nitrospira','Centrocercus', 'Fungus','Schistosoma', 'Zostera']

def find_entity(x):
    if ('ChemicalSubstance' in x)|('Disease' in x)|('Species' in x):
        return True

def find_entity_all(x):
    if ('ChemicalSubstance' in x)|('Disease' in x)|('Species' in x)|('PopulatedPlace' in x)|('BodyOfWater' in x):
        return True

# keep chemical and disease entities, and Species entities in species 
def filter_pollution(df):
    filter_p=df['type'].apply(lambda x: 'Species' in x)&(~df['entityId'].isin(species))
    return df[~filter_p]

# get list of articles with either disease or pollutant infomation
def get_article(df):
    df_pollution =(df.assign(useful= lambda x: x['type'].apply(lambda i:  find_entity(i)))
                                .query('useful==useful')
                                .query('(entityId!="Water")&(entityId!="Plant")&(entityId!="Animal")&(entityId!="Life")')
                                .pipe(filter_pollution)
                    )
    article_list=df_pollution.url.unique()
    return article_list

# redefine some species into pollutants
def redefine_type(ent_type):
    if ('ChemicalSubstance' in ent_type) | ('Species' in ent_type):
        return 'pollutant'
    elif 'Disease' in ent_type:
        return 'dis'
    elif 'Place' in ent_type:
        return 'place'

# Given an unpacked entity df, return a df with pollutants, disease and places mentioned
def get_pollution_info(df):
    df=df[~df['type'].isna()]
    df.reset_index(inplace=True)
    article_list=get_article(df)
    entity_use = (df.assign(useful= lambda x: x['type'].apply(lambda i:  find_entity_all(i)))
                    .assign (spec = lambda x : x['type'].apply(lambda i : 'Species' in i ))
                    .query('useful==useful')
                    .query('(entityId!="Water")&(entityId!="Plant")&(entityId!="Animal")&(entityId!="Life")')
                    .query('url in @article_list')
                    .query('spec==False|(entityId in @species)')
                    .assign (newtype = lambda x: x['type'].apply(lambda i : redefine_type(i) ))

     )
    entity_use.reset_index(inplace=True,drop=True)
    
    grouped_entity=(entity_use.groupby(['url','newtype'])['entityId'].apply(list).to_frame()
                    .assign(entityId = lambda x: x['entityId'].apply(lambda i: list(set(i))))
        )
    grouped_entity.reset_index(inplace=True)
    grouped_entity_pivot=pd.pivot_table(grouped_entity, values='entityId', index=['url'],columns=['newtype'], aggfunc='first')
    grouped_entity_pivot.reset_index(inplace=True)
    return grouped_entity_pivot
    