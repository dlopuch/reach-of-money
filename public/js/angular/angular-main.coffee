'use strict'

appConfig = ['$routeProvider', '$locationProvider', '$httpProvider', '$modalProvider', ($routeProvider, $locationProvider, $httpProvider) ->
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

  $locationProvider.html5Mode true

  $routeProvider
  .when '/',
    templateUrl: 'index.html'

  .when '/about',
    templateUrl: 'about.html'

  .otherwise
      template: '<h3>Whoops, page not found</h3>'

window.App = angular.module('voice-of-money', [ 'ngRoute', 'ngAnimate', 'v-o-m.services', 'v-o-m.directives' ]).config(appConfig)

servicesConfig = ['$httpProvider', ($httpProvider) ->
  $httpProvider.responseInterceptors.push('errorHttpInterceptor')
]
App.Services = angular.module('v-o-m.services', ['ngResource', 'ngCookies']).config(servicesConfig).run(['$rootScope', '$location', ($rootScope, $location) -> $rootScope.location = $location])

App.Directives = angular.module('v-o-m.directives', [])


#Global Debug Functions
window.getSrv = (name, element) ->        # angular.element(document).injector() to get the current app injector
  element = element or "*[ng-app]"
  angular.element(element).injector().get name

window.getScope = (element) ->        # to get the current scope for the element
  angular.element(element).scope()

#angular.element(domElement).controller() # to get a hold of the ng-controller instance.
