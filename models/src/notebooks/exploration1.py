import os
print(os.getcwd())

import pandas as pd
import numpy as np

from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors

#
import matplotlib.pyplot as plt
import seaborn as sns

# Datasets
# movies = pd.read_csv("./movies.csv")
# ratings = pd.read_csv("./ratings.csv")
directory = os.getcwd()

movies = pd.read_csv(os.path.join(directory, "movies.csv"))
ratings = pd.read_csv(os.path.join(directory, "ratings.csv"))


ratings.head()

movies.head()

final_dataset = ratings.pivot(index='movieId', columns='userId', values='rating')
final_dataset.head()

final_dataset.fillna(0, inplace=True)
final_dataset.head()

no_user_voted = ratings.groupby('movieId')['rating'].agg('count')
no_movies_voted = ratings.groupby('userId')['rating'].agg('count')

no_user_voted = ratings.groupby('movieId')['rating'].agg('count')
no_movies_voted = ratings.groupby('userId')['rating'].agg('count')

f,ax = plt.subplots(1,1,figsize=(16,4))
# ratings['rating'].plot(kind='hist')
plt.scatter(no_user_voted.index,no_user_voted,color='mediumseagreen')
plt.axhline(y=10,color='r')
plt.xlabel('MovieId')
plt.ylabel('No. of users voted')
plt.show()


final_dataset = final_dataset.loc[no_user_voted[no_user_voted > 10].index,:]

f,ax = plt.subplots(1,1,figsize=(16,4))
plt.scatter(no_movies_voted.index,no_movies_voted,color='mediumseagreen')
plt.axhline(y=50,color='r')
plt.xlabel('UserId')
plt.ylabel('No. of votes by user')
plt.show()

final_dataset=final_dataset.loc[:,no_movies_voted[no_movies_voted > 50].index]
final_dataset

sample = np.array([[0,0,3,0,0],[4,0,0,0,2],[0,0,0,0,1]])
sparsity = 1.0 - ( np.count_nonzero(sample) / float(sample.size) )
print(sparsity)

csr_sample = csr_matrix(sample)
print(csr_sample)

final_dataset.values

csr_data = csr_matrix(final_dataset.values)
final_dataset.reset_index(inplace=True)

knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=20, n_jobs=-1)

knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=20, n_jobs=-1)
knn.fit(csr_data)

def get_movie_recommendation(movie_name):
    n_movies_to_reccomend = 10
    movie_list = movies[movies['title'].str.contains(movie_name)]
    
    if len(movie_list):
        movie_id = movie_list.iloc[0]['movieId']
        
        # This is the key fix - find the row index where movieId matches in final_dataset
        movie_idx = final_dataset[final_dataset['movieId'] == movie_id].index[0]
        
        distances, indices = knn.kneighbors(csr_data[movie_idx], n_neighbors=n_movies_to_reccomend+1)
        
        rec_movie_indices = sorted(list(zip(indices.squeeze().tolist(), distances.squeeze().tolist())),
                               key=lambda x: x[1])[:0:-1]
        
        recommend_frame = []
        
        for val in rec_movie_indices:
            movie_id = final_dataset.iloc[val[0]]['movieId']
            idx = movies[movies['movieId'] == movie_id].index
            recommend_frame.append({'Title': movies.iloc[idx]['title'].values[0], 'Distance': val[1]})
        
        df = pd.DataFrame(recommend_frame, index=range(1, n_movies_to_reccomend+1))
        return df
    
    else:
        return "No movies found. Please check your input"
    
get_movie_recommendation('Iron Man')
get_movie_recommendation('Memento')