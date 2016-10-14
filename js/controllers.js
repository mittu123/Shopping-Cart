/**
 * Created by Sahil on 9/20/2016.
 */

'use strict';

// the storeController contains two objects:
// - store: contains the product list
// - cart: the shopping cart object
function storeController($scope, $routeParams, DataService) {

    // get store and cart from service
    console.log(DataService.products);
    $scope.store = DataService.products;
    $scope.cart = DataService.cart;

}

