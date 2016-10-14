/**
 * Created by Sahil on 9/16/2016.
 */

var app = angular.module('Cart', ['ngRoute','ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'cart/cart.htm',
        controller: 'storeController' }).
    otherwise({
        redirectTo: '/404.htm' });
}]);


app.factory("DataService", function ($http) {
     return $http.get('cart.json');
});



app.controller('storeController', function ($scope,$uibModal, DataService) {

    // get store and cart from service
    $scope.products = {};
    DataService.success(function(data) {
        $scope.products = data.productsInCart;
    });
    $scope.coupon_code = '';
    $scope.shipping = 1;


    $scope.getTotalPrice = function(){
        var total = 0;
        for(var i = 0, len = $scope.products.length; i < len; i++){
            var prod = $scope.products[i];
            total += (prod.p_quantity * prod.p_price);
        }
        return total;
    };

    $scope.totalItems = function () {
        var total = 0;
        for(var i = 0, len = $scope.products.length; i < len; i++){
            var prod = $scope.products[i];
            total += (prod.p_quantity);
        }
        return total;
    };
    $scope.dis = 0;
    $scope.getDiscountedPrice = function (subtotal) {
        var len = $scope.totalItems();
        var discountedPrice = '';
        if(len <= 3){
            $scope.dis = 5;
        }else if(len > 3 && len < 6){
            $scope.dis = 10;
        }else if(len > 6 && len <= 10){
            $scope.dis = 20;
        }else{
            $scope.dis = 25;
        }
        discountedPrice = (subtotal*0.01*$scope.dis);
        return discountedPrice;
    };

    $scope.removeItem = function (id) {
        $scope.products = $scope.products.filter(function (item) {
            return item.p_id!=id;
        })
    };


    $scope.openModal = function (id) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'cart/modal.htm',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                items: function () {
                    return $scope.products[id-1];
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            console.log(selectedItem);
            $scope.products[id-1].p_quantity = selectedItem.quantity;
            $scope.products[id-1].p_selected_size = selectedItem.size;
            $scope.products[id-1].p_selected_color = selectedItem.selectedColor;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

});


app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

    $scope.prod = items;
    $scope.options = [];
    $scope.quantity = items.p_quantity;
    $scope.selectedSize = items.p_available_options.sizes[0].code;

    //Fill array with incremental numbers
    while ($scope.options.length < 100){
        $scope.options.push($scope.options.length + 1);
    }

    $scope.selectedItem = $scope.options[0];
    $scope.selectedColor= {};
    $scope.selColor = function (name,hexcode) {
        $scope.selectedColor['name'] = name;
        $scope.selectedColor['hexcode'] = hexcode;
    };


    $scope.ok = function () {
        var res = {};
        res['quantity'] = $scope.quantity;
        res['size'] = $scope.size;
        res['selectedColor'] = $scope.selectedColor;
        $uibModalInstance.close(res);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});