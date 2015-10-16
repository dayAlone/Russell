import { GET_CATEGORIES, GET_COLLECTIONS, GET_PRODUCTS } from '../constants/Catalog';

const initialState = {
    categories: [],
    collections: [],
    products: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_CATEGORIES:
          return Object.assign({}, state, {
            categories: action.data
          });
        case GET_COLLECTIONS:
          return Object.assign({}, state, {
            collections: action.data
          });
        case GET_PRODUCTS:
          return Object.assign({}, state, {
            products: action.data
          });
        default:
            return state;
    }
}
