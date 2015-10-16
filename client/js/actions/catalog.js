import { GET_CATEGORIES, GET_COLLECTIONS, GET_PRODUCTS } from '../constants/Catalog';

export function getCategories() {
    return dispatch => {
        $.get('/catalog/category/get/', data => {
            if (!data.error) {
                dispatch({
                    type: GET_CATEGORIES,
                    data: data.result
                });
            }
        });
    };
}

export function getCollections() {
    return dispatch => {
        $.get('/catalog/collection/get/', data => {
            if (!data.error) {
                dispatch({
                    type: GET_COLLECTIONS,
                    data: data.result
                });
            }
        });
    };
}

export function getProducts() {
    return dispatch => {
        $.get('/catalog/product/get/', data => {
            if (!data.error) {
                dispatch({
                    type: GET_PRODUCTS,
                    data: data.result
                });
            }
        });
    };
}
