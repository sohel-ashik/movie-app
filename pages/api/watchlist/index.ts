// pages/api/watchlist/index.ts
import { NextApiRequest, NextApiResponse } from "next";

let watchlistSet = new Set<number>(); // This will store the movie IDs
let movieMap = new Map<number, any>(); // This will store the movie objects

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    if(req?.query?.id){
        return isAvailableMovie(req,res);
    } else if(req?.query?.gettype == 'getFavouriteIds'){
        res.status(200).json(Array.from(movieMap.keys()));
    }
    else res.status(200).json(Array.from(movieMap.values()));

  } else if (req.method === "POST") {
    const { movie } = req.body;
    if (!watchlistSet.has(movie.id)) {
      watchlistSet.add(movie.id); 
      movieMap.set(movie.id, movie); 
      res.status(201).json({ message: "Movie added to the watchlist", watchlist: Array.from(movieMap.values()) });
    } else {
      res.status(409).json({ message: "Movie is already in the watchlist" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query; 
    const movieId = parseInt(id as string);

    if (watchlistSet.has(movieId)) {
      watchlistSet.delete(movieId); 
      movieMap.delete(movieId); 
      res.status(200).json({ message: `Movie with ID ${id} deleted`, watchlist: Array.from(movieMap.values()) });
    } else {
      res.status(404).json({ message: `Movie with ID ${id} not found` });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}


export function isAvailableMovie(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
      const { id } = req.query; // Get movie ID from the query params
  
      if (id) {
        const movieId = parseInt(id as string);
  
        // Check if the movie is available in the watchlist (movieMap)
        if (movieMap.has(movieId)) {
          res.status(200).json({ available: true, message: `Movie with ID ${id} is available in the watchlist` });
        } else {
          res.status(200).json({ available: false, message: `Movie with ID ${id} is not available in the watchlist` });
        }
      } else {
        res.status(400).json({ available: false, message: "Movie ID is required" });
      }
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
}