/**
 * Backward-compatibility proxy layer.
 * Delegates all queries to the dedicated models in src/models/.
 * New code should import models directly from '@/models'.
 */
import {
  Users,
  Artworks,
  Bids,
  Transactions,
  Watchlists,
  Activities,
} from "@/models";

// User models
export const hashValue = Users.hashPassword;
export const createUser = Users.create;
export const updateUser = Users.update;
export const getUser = Users.get;
export const getUsers = Users.getAll;
export const getUserRole = Users.getRole;
export const getPermissions = Users.getPermissions;
export const getUserPermissions = Users.getUserPermissions;
export const getUsersProfile = Users.getProfile;

// Artwork models
export const createArtwork = Artworks.create;
export const updateArtwork = Artworks.update;
export const getArtworkById = Artworks.getById;
export const getArtworks = Artworks.getAll;

// Bid models
export const getBids = Bids.get;
export const getBidsByUser = Bids.getByUser;
export const createBid = Bids.create;

// Transaction models
export const updateTransaction = Transactions.update;
export const getTransactions = Transactions.get;
export const getTransactionByReference = Transactions.getByReference;
export const createTransaction = Transactions.create;

// Watchlist & Activity models
export const getWatchlist = Watchlists.get;
export const getActivity = Activities.get;