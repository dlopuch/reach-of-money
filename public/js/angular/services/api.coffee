# Rest
CurrentUser = ($resource) ->
  $resource '/currentuser'

Hub = ($resource) ->
  $resource '/hubs/:id',
    id: '@id'
  ,
    update:
      method: 'PUT'


# Resources
UserOmniauthResource = ($http) ->
  UserOmniauth = (options) ->
    angular.extend this, options

  UserOmniauth::$save = ->
    $http.post '/authentications',
      auth: @auth

  UserOmniauth::$destroy = ->
    $http.delete "/users/logout"

  UserOmniauth


UserRegistrationResource = ($http) ->
  UserRegistration = (options) ->
    angular.extend this, options

  UserRegistration::$save = ->
    $http.post "/users",
      user:
        name: @name
        email: @email
        password: @password
        password_confirmation: @password_confirmation

  UserRegistration

# Loaders

CurrentHubLoader = (Hub, $route, $q) ->
  ->
    delay = $q.defer()
    if $route.current.params.hub
      Hub.get
        id: $route.current.params.hub
      , (hub) ->
        delay.resolve hub
      , ->
        delay.reject 'Unable to locate a hub '
    else
      delay.resolve false
    delay.promise

# Injects
Hub.$inject = [ '$resource' ]

UserOmniauthResource.$inject = [ '$http' ]
UserRegistrationResource.$inject = [ '$http' ]

CurrentHubLoader.$inject = [ 'Hub', '$route', '$q' ]

# Register
App.Services.factory 'Hub', Hub
App.Services.factory 'CurrentHubLoader', CurrentHubLoader
App.Services.factory 'UserOmniauthResource', UserOmniauthResource
App.Services.factory 'UserRegistrationResource', UserRegistrationResource

