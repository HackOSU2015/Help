
helpApp.controller('SearchController', function($scope, $http, ModalService) {
	

	$scope.view = "partials/search.html";
	$scope.search = {};
	$scope.search.opts = ["Hospital", "Malady"];
	$scope.search.currentOpt = 	$scope.search.opts[0]
	
	$http.get('tags.json').success(function(data) {
    	$scope.tags = data;
    	console.log(data);
	});

	$scope.search.results = [
		
		{
			hospitalName:"Wexner Medical Center",
			
			overallRating:4,
			
			tags:[{tagName:"knee pain", rating:4},
				{tagName:"back pain", rating:4},
				{tagName:"cancer", rating:4}],
			
			reviews:["This is a beautiful review",
					"This is also a beautiful review"],	
			
			description:"This is a beautiful place..."
		}
	]

	$scope.setQueryType = function(option) {
		$scope.search.currentOpt = option;
	}	

	$scope.searchQuery = function() {
		var searchQuery="?" + $scope.search.currentOpt.toLowerCase()
			+ "=" + $scope.search.query;
		console.log(searchQuery);


		$http.get("/search+searchQuery").success(function(data) {
			$scope.view = "partials/search-results.html";	
			$scope.search.results = data;
		})

	}

	$scope.goToDetailsPage = function(hospital) {
		$scope.search.currentHospital = hospital;
		$scope.view = "partials/hospital-details.html";
	}

	$scope.getCount = function(number) {
		return new Array(number);
	}

	$scope.showAddReviewModal = function() {
		console.log("Show modal")
		ModalService.showModal({
			templateUrl:'partials/add-review-modal.html',
			controller: "ReviewModalController",
			inputs: {
				tags: $scope.tags
			}
		}).then(function(modal) {
			modal.element.modal();
			modal.close.then(function(result) {
				$http.post("/update", result).success(function(data) {

				});
			})
		})
	}
})

helpApp.controller("ReviewModalController", function($scope, tags, close) {
	$scope.tags = tags;
	$scope.rating = 1;
	$scope.isReadOnly = false;
	$scope.review = {rating:1, description:""};
	$scope.closeModal = function() {
    	close({description: $scope.review.description,
    	rating: $scope.review.rating,
    	tag: $scope.review.tag.title}, 200); // close, but give 200ms for bootstrap to animate
 	};
 	$scope.cancel = function(result) {
 		close(null, 200);
 	}



})

helpApp.directive("starRating", starRating);

function starRating() {
    return {
      restrict: 'EA',
      template:
        '<ul class="star-rating" ng-class="{readonly: readonly}">' +
        '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
        '    <i class="fa fa-star"></i>' + // or &#9733
        '  </li>' +
        '</ul>',
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?'
      },
      link: function(scope, element, attributes) {
        if (scope.max == undefined) {
          scope.max = 5;
        }
        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };
        scope.toggle = function(index) {
          if (scope.readonly == undefined || scope.readonly === false){
            scope.ratingValue = index + 1;
            scope.onRatingSelect({
              rating: index + 1
            });
          }
        };
        scope.$watch('ratingValue', function(oldValue, newValue) {
          if (newValue) {
            updateStars();
          }
        });
      }
    };
  }
