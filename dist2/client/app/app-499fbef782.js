"use strict";angular.module("appApp",["appApp.auth","appApp.admin","appApp.constants","ngCookies","ngResource","ngSanitize","btford.socket-io","ui.router","validation.match"]).config(["$urlRouterProvider","$locationProvider",function(n,t){n.otherwise("/"),t.html5Mode(!0)}]),angular.module("appApp.admin",["appApp.auth","ui.router"]),angular.module("appApp.auth",["appApp.constants","appApp.util","ngCookies","ui.router"]).config(["$httpProvider",function(n){n.interceptors.push("authInterceptor")}]),angular.module("appApp.util",[]),angular.module("appApp").config(["$stateProvider",function(n){n.state("login",{url:"/login",templateUrl:"app/account/login/login.html",controller:"LoginController",controllerAs:"vm"}).state("logout",{url:"/logout?referrer",referrer:"main",template:"",controller:["$state","Auth",function(n,t){var e=n.params.referrer||n.current.referrer||"main";t.logout(),n.go(e)}]}).state("signup",{url:"/signup",templateUrl:"app/account/signup/signup.html",controller:"SignupController",controllerAs:"vm"}).state("settings",{url:"/settings",templateUrl:"app/account/settings/settings.html",controller:"SettingsController",controllerAs:"vm",authenticate:!0})}]).run(["$rootScope",function(n){n.$on("$stateChangeStart",function(n,t,e,r){"logout"===t.name&&r&&r.name&&!r.authenticate&&(t.referrer=r.name)})}]);var LoginController=function(){function n(n,t){this.user={},this.errors={},this.submitted=!1,this.Auth=n,this.$state=t}return n.$inject=["Auth","$state"],n.prototype.login=function(n){var t=this;this.submitted=!0,n.$valid&&this.Auth.login({username:this.user.name,password:this.user.password}).then(function(){t.$state.go("main")})["catch"](function(n){t.errors.other=n.message})},n}();angular.module("appApp").controller("LoginController",LoginController);var SettingsController=function(){function n(n){this.errors={},this.submitted=!1,this.Auth=n}return n.$inject=["Auth"],n.prototype.changePassword=function(n){var t=this;this.submitted=!0,n.$valid&&this.Auth.changePassword(this.user.oldPassword,this.user.newPassword).then(function(){t.message="Password successfully changed."})["catch"](function(){n.password.$setValidity("mongoose",!1),t.errors.other="Incorrect password",t.message=""})},n}();angular.module("appApp").controller("SettingsController",SettingsController);var SignupController=function(){function n(n,t){this.user={},this.errors={},this.submitted=!1,this.Auth=n,this.$state=t}return n.$inject=["Auth","$state"],n.prototype.register=function(n){var t=this;this.submitted=!0,n.$valid&&this.Auth.createUser({name:this.user.name,email:this.user.email,password:this.user.password}).then(function(){t.$state.go("main")})["catch"](function(e){e=e.data,t.errors={},angular.forEach(e.errors,function(e,r){n[r].$setValidity("mongoose",!1),t.errors[r]=e.message})})},n}();angular.module("appApp").controller("SignupController",SignupController),function(){var n=function(){function n(n){this.users=n.query()}return n.$inject=["User"],n.prototype["delete"]=function(n){n.$remove(),this.users.splice(this.users.indexOf(n),1)},n}();angular.module("appApp.admin").controller("AdminController",n)}(),angular.module("appApp.admin").config(["$stateProvider",function(n){n.state("admin",{url:"/admin",templateUrl:"app/admin/admin.html",controller:"AdminController",controllerAs:"admin",authenticate:"admin"})}]),function(n,t){n.module("appApp.constants",[]).constant("appConfig",{userRoles:["guest","user","admin"]})}(angular),function(){var n=function(){function n(n,t,e,r){var o=this;this.$http=n,this.Auth=r,this.awesomeThings=[],n.get("/api/things").then(function(n){o.awesomeThings=n.data,e.syncUpdates("thing",o.awesomeThings)}),t.$on("$destroy",function(){e.unsyncUpdates("thing")})}return n.$inject=["$http","$scope","socket","Auth"],n.prototype.addThing=function(){this.newThing&&(this.$http.post("/api/things",{name:this.newThing}),this.newThing="")},n.prototype.deleteThing=function(n){this.$http["delete"]("/api/things/"+n._id)},n.prototype.getFBFriends=function(){this.$http.get("https://graph.facebook.com/me/friends?access_token="+this.Auth.getToken())},n}();angular.module("appApp").controller("MainController",n)}(),angular.module("appApp").config(["$stateProvider",function(n){n.state("main",{url:"/",templateUrl:"app/main/main.html",controller:"MainController",controllerAs:"main"})}]),function(){function n(n,t,e,r,o,s,a){var i=s.safeCb,l={},u=o.userRoles||[];e.get("token")&&"/logout"!==n.path()&&(l=a.get());var c={login:function(n,o){var s=n.username,u=n.password;return t.post("/auth/local",{username:s,password:u}).then(function(n){return e.put("token",n.data.token),l=a.get(),l.$promise}).then(function(n){return i(o)(null,n),n})["catch"](function(n){return c.logout(),i(o)(n.data),r.reject(n.data)})},logout:function(){e.remove("token"),l={}},createUser:function(n,t){return a.save(n,function(r){return e.put("token",r.token),l=a.get(),i(t)(null,n)},function(n){return c.logout(),i(t)(n)}).$promise},changePassword:function(n,t,e){return a.changePassword({id:l._id},{oldPassword:n,newPassword:t},function(){return i(e)(null)},function(n){return i(e)(n)}).$promise},getCurrentUser:function(n){if(0===arguments.length)return l;var t=l.hasOwnProperty("$promise")?l.$promise:l;return r.when(t).then(function(t){return i(n)(t),t},function(){return i(n)({}),{}})},isLoggedIn:function(n){return 0===arguments.length?l.hasOwnProperty("role"):c.getCurrentUser(null).then(function(t){var e=t.hasOwnProperty("role");return i(n)(e),e})},hasRole:function(n,t){var e=function(n,t){return u.indexOf(n)>=u.indexOf(t)};return arguments.length<2?e(l.role,n):c.getCurrentUser(null).then(function(r){var o=r.hasOwnProperty("role")?e(r.role,n):!1;return i(t)(o),o})},isAdmin:function(){return c.hasRole.apply(c,[].concat.apply(["admin"],arguments))},getToken:function(){return e.get("token")}};return c}n.$inject=["$location","$http","$cookies","$q","appConfig","Util","User"],angular.module("appApp.auth").factory("Auth",n)}(),function(){function n(n,t,e,r,o){var s;return{request:function(n){return n.headers=n.headers||{},e.get("token")&&o.isSameOrigin(n.url)&&(n.headers.Authorization="Bearer "+e.get("token")),n},responseError:function(n){return 401===n.status&&((s||(s=r.get("$state"))).go("login"),e.remove("token")),t.reject(n)}}}n.$inject=["$rootScope","$q","$cookies","$injector","Util"],angular.module("appApp.auth").factory("authInterceptor",n)}(),function(){angular.module("appApp.auth").run(["$rootScope","$state","Auth",function(n,t,e){n.$on("$stateChangeStart",function(n,r){r.authenticate&&("string"==typeof r.authenticate?e.hasRole(r.authenticate,_.noop).then(function(r){return r?void 0:(n.preventDefault(),e.isLoggedIn(_.noop).then(function(n){t.go(n?"main":"login")}))}):e.isLoggedIn(_.noop).then(function(e){e||(n.preventDefault(),t.go("main"))}))})}])}(),function(){function n(n){return n("/api/users/:id/:controller",{id:"@_id"},{changePassword:{method:"PUT",params:{controller:"password"}},get:{method:"GET",params:{id:"me"}}})}n.$inject=["$resource"],angular.module("appApp.auth").factory("User",n)}(),angular.module("appApp").directive("footer",function(){return{templateUrl:"components/footer/footer.html",restrict:"E",link:function(n,t){t.addClass("footer")}}}),angular.module("appApp").directive("mongooseError",function(){return{restrict:"A",require:"ngModel",link:function(n,t,e,r){t.on("keydown",function(){return r.$setValidity("mongoose",!0)})}}});var NavbarController=function(){function n(n){this.menu=[{title:"Home",state:"main"}],this.isCollapsed=!0,this.isLoggedIn=n.isLoggedIn,this.isAdmin=n.isAdmin,this.getCurrentUser=n.getCurrentUser}return n.$inject=["Auth"],n}();angular.module("appApp").controller("NavbarController",NavbarController),angular.module("appApp").directive("navbar",function(){return{templateUrl:"components/navbar/navbar.html",restrict:"E",controller:"NavbarController",controllerAs:"nav"}}),angular.module("appApp").controller("OauthButtonsCtrl",["$window",function(n){this.loginOauth=function(t){n.location.href="/auth/"+t}}]),angular.module("appApp").directive("oauthButtons",function(){return{templateUrl:"components/oauth-buttons/oauth-buttons.html",restrict:"EA",controller:"OauthButtonsCtrl",controllerAs:"OauthButtons",scope:{classes:"@"}}}),angular.module("appApp").factory("socket",["socketFactory",function(n){var t=io("",{path:"/socket.io-client"}),e=n({ioSocket:t});return{socket:e,syncUpdates:function(n,t,r){r=r||angular.noop,e.on(n+":save",function(n){var e=_.find(t,{_id:n._id}),o=t.indexOf(e),s="created";e?(t.splice(o,1,n),s="updated"):t.push(n),r(s,n,t)}),e.on(n+":remove",function(n){var e="deleted";_.remove(t,{_id:n._id}),r(e,n,t)})},unsyncUpdates:function(n){e.removeAllListeners(n+":save"),e.removeAllListeners(n+":remove")}}}]),function(){function n(n){var t={safeCb:function(n){return angular.isFunction(n)?n:angular.noop},urlParse:function(n){var t=document.createElement("a");return t.href=n,""===t.host&&(t.href=t.href),t},isSameOrigin:function(e,r){return e=t.urlParse(e),r=r&&[].concat(r)||[],r=r.map(t.urlParse),r.push(n.location),r=r.filter(function(n){return e.hostname===n.hostname&&e.port===n.port&&e.protocol===n.protocol}),r.length>=1}};return t}n.$inject=["$window"],angular.module("appApp.util").factory("Util",n)}(),angular.module("appApp").run(["$templateCache",function(n){n.put("app/admin/admin.html",'<div class="container">\n  <p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p>\n  <ul class="list-group user-list">\n    <li class="list-group-item" ng-repeat="user in admin.users">\n	    <div class="user-info">\n	        <strong>{{user.name}}</strong><br>\n	        <span class="text-muted">{{user.email}}</span>\n	    </div>\n        <a ng-click="admin.delete(user)" class="trash"><span class="fa fa-trash fa-2x"></span></a>\n    </li>\n  </ul>\n</div>\n'),n.put("app/main/main.html",'<header class="hero-unit" id="banner">\n  <div class="container">\n    <h1>\'Allo, \'Allo!</h1>\n    <p class="lead">Kick-start your next web app with Angular Fullstack</p>\n    <img src="assets/images/yeoman-462ccecbb1.png" alt="I\'m Yeoman">\n  </div>\n</header>\n\n<div class="container">\n  <div class="row">\n    <div class="col-lg-12">\n      <h1 class="page-header">Features:</h1>\n      <ul class="nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6" ng-repeat="thing in main.awesomeThings">\n        <li><a href="#" tooltip="{{thing.info}}">{{thing.name}}<button type="button" class="close" ng-click="main.deleteThing(thing)">&times;</button></a></li>\n      </ul>\n    </div>\n  </div>\n\n  <div class="row">\n    <div class="col-lg-12">\n      <button class="btn" ng-click="main.getFBFriends()">Get FB friends</button>\n    </div>\n  </div>\n\n  <form class="thing-form">\n    <label>Syncs in realtime across clients</label>\n    <p class="input-group">\n      <input type="text" class="form-control" placeholder="Add a new thing here." ng-model="main.newThing">\n      <span class="input-group-btn">\n        <button type="submit" class="btn btn-primary" ng-click="main.addThing()">Add New</button>\n      </span>\n    </p>\n  </form>\n</div>\n'),n.put("components/footer/footer.html",'<div class="container">\n  <p>Angular Fullstack v3.3.0 |\n    <a href="https://twitter.com/tyhenkel">@tyhenkel</a> |\n    <a href="https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open">Issues</a>\n  </p>\n</div>\n'),n.put("components/navbar/navbar.html",'<div class="navbar navbar-default navbar-static-top" ng-controller="NavbarController">\n  <div class="container">\n    <div class="navbar-header">\n      <button class="navbar-toggle" type="button" ng-click="nav.isCollapsed = !nav.isCollapsed">\n        <span class="sr-only">Toggle navigation</span>\n        <span class="icon-bar"></span>\n        <span class="icon-bar"></span>\n        <span class="icon-bar"></span>\n      </button>\n      <a href="/" class="navbar-brand">app</a>\n    </div>\n    <div collapse="nav.isCollapsed" class="navbar-collapse collapse" id="navbar-main">\n      <ul class="nav navbar-nav">\n        <li ng-repeat="item in nav.menu" ui-sref-active="active">\n            <a ui-sref="{{item.state}}">{{item.title}}</a>\n        </li>\n        <li ng-show="nav.isAdmin()" ui-sref-active="active"><a ui-sref="admin">Admin</a></li>\n      </ul>\n\n      <ul class="nav navbar-nav navbar-right">\n        <li ng-hide="nav.isLoggedIn()" ui-sref-active="active"><a ui-sref="signup">Sign up</a></li>\n        <li ng-hide="nav.isLoggedIn()" ui-sref-active="active"><a ui-sref="login">Login</a></li>\n        <li ng-show="nav.isLoggedIn()"><p class="navbar-text">Hello {{ nav.getCurrentUser().name }}</p> </li>\n        <li ng-show="nav.isLoggedIn()" ui-sref-active="active"><a ui-sref="settings"><span class="glyphicon glyphicon-cog"></span></a></li>\n        <li ng-show="nav.isLoggedIn()"><a ui-sref="logout">Logout</a></li>\n      </ul>\n    </div>\n  </div>\n</div>\n'),n.put("components/oauth-buttons/oauth-buttons.html",'<a ng-class="classes" ng-click="OauthButtons.loginOauth(\'facebook\')" class="btn btn-social btn-facebook">\n  <i class="fa fa-facebook"></i>\n  Connect with Facebook\n</a>\n\n'),n.put("app/account/login/login.html",'<div class="container">\n    <div class="row">\n        <div class="col-sm-12">\n            <h1>Login</h1>\n        </div>\n        <div class="col-sm-12">\n            <form class="form" name="form" ng-submit="vm.login(form)" novalidate>\n                <div class="form-group">\n                    <label>Username</label>\n                    <input type="text" name="name" class="form-control" ng-model="vm.user.name" required>\n                </div>\n                <div class="form-group">\n                    <label>Password</label>\n                    <input type="password" name="password" class="form-control" ng-model="vm.user.password" required>\n                </div>\n                <div class="form-group has-error">\n                    <p class="help-block" ng-show="form.email.$error.required && form.password.$error.required && vm.submitted">\n                        Please enter your email and password.\n                    </p>\n<!--                     <p class="help-block" ng-show="form.email.$error.email && vm.submitted">\n                        Please enter a valid email.\n                    </p> -->\n                    <p class="help-block">{{ vm.errors.other }}</p>\n                </div>\n                <div>\n                    <button class="btn btn-inverse btn-lg btn-login" type="submit">\n                        Login\n                    </button>\n                    <a class="btn btn-default btn-lg btn-register" ui-sref="signup">\n            Register\n          </a>\n                </div>\n                <hr/>\n                <div class="row">\n                    <div class="col-sm-4 col-md-3">\n                        <oauth-buttons classes="btn-block"></oauth-buttons>\n                    </div>\n                </div>\n            </form>\n        </div>\n    </div>\n    <hr>\n</div>\n'),n.put("app/account/signup/signup.html",'<div class="container">\n  <div class="row">\n    <div class="col-sm-12">\n      <h1>Sign up</h1>\n    </div>\n    <div class="col-sm-12">\n      <form class="form" name="form" ng-submit="vm.register(form)" novalidate>\n\n        <div class="form-group" ng-class="{ \'has-success\': form.name.$valid && vm.submitted,\n                                            \'has-error\': form.name.$invalid && vm.submitted }">\n          <label>Name</label>\n\n          <input type="text" name="name" class="form-control" ng-model="vm.user.name"\n                 required/>\n          <p class="help-block" ng-show="form.name.$error.required && vm.submitted">\n            A name is required\n          </p>\n        </div>\n\n        <div class="form-group" ng-class="{ \'has-success\': form.email.$valid && vm.submitted,\n                                            \'has-error\': form.email.$invalid && vm.submitted }">\n          <label>Email</label>\n\n          <input type="email" name="email" class="form-control" ng-model="vm.user.email"\n                 required\n                 mongoose-error/>\n          <p class="help-block" ng-show="form.email.$error.email && vm.submitted">\n            Doesn\'t look like a valid email.\n          </p>\n          <p class="help-block" ng-show="form.email.$error.required && vm.submitted">\n            What\'s your email address?\n          </p>\n          <p class="help-block" ng-show="form.email.$error.mongoose">\n            {{ vm.errors.email }}\n          </p>\n        </div>\n\n        <div class="form-group" ng-class="{ \'has-success\': form.password.$valid && vm.submitted,\n                                            \'has-error\': form.password.$invalid && vm.submitted }">\n          <label>Password</label>\n\n          <input type="password" name="password" class="form-control" ng-model="vm.user.password"\n                 ng-minlength="3"\n                 required\n                 mongoose-error/>\n          <p class="help-block"\n             ng-show="(form.password.$error.minlength || form.password.$error.required) && vm.submitted">\n            Password must be at least 3 characters.\n          </p>\n          <p class="help-block" ng-show="form.password.$error.mongoose">\n            {{ vm.errors.password }}\n          </p>\n        </div>\n\n        <div class="form-group" ng-class="{ \'has-success\': form.confirmPassword.$valid && vm.submitted,\n                                            \'has-error\': form.confirmPassword.$invalid && vm.submitted }">\n          <label>Confirm Password</label>\n          <input type="password" name="confirmPassword" class="form-control" ng-model="vm.user.confirmPassword"\n                 match="vm.user.password"\n                 ng-minlength="3" required/>\n          <p class="help-block"\n             ng-show="form.confirmPassword.$error.match && vm.submitted">\n            Passwords must match.\n          </p>\n        </div>\n\n        <div>\n          <button class="btn btn-inverse btn-lg btn-register" type="submit">\n            Sign up\n          </button>\n          <a class="btn btn-default btn-lg btn-login" ui-sref="login">\n            Login\n          </a>\n        </div>\n\n        <hr/>\n        <div class="row">\n          <div class="col-sm-4 col-md-3">\n            <oauth-buttons classes="btn-block"></oauth-buttons>\n          </div>\n        </div>\n      </form>\n    </div>\n  </div>\n  <hr>\n</div>\n'),n.put("app/account/settings/settings.html",'<div class="container">\n  <div class="row">\n    <div class="col-sm-12">\n      <h1>Change Password</h1>\n    </div>\n    <div class="col-sm-12">\n      <form class="form" name="form" ng-submit="vm.changePassword(form)" novalidate>\n\n        <div class="form-group">\n          <label>Current Password</label>\n\n          <input type="password" name="password" class="form-control" ng-model="vm.user.oldPassword"\n                 mongoose-error/>\n          <p class="help-block" ng-show="form.password.$error.mongoose">\n              {{ vm.errors.other }}\n          </p>\n        </div>\n\n        <div class="form-group">\n          <label>New Password</label>\n\n          <input type="password" name="newPassword" class="form-control" ng-model="vm.user.newPassword"\n                 ng-minlength="3"\n                 required/>\n          <p class="help-block"\n             ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || vm.submitted)">\n            Password must be at least 3 characters.\n          </p>\n        </div>\n\n        <div class="form-group">\n          <label>Confirm New Password</label>\n\n          <input type="password" name="confirmPassword" class="form-control" ng-model="vm.user.confirmPassword"\n                 match="vm.user.newPassword"\n                 ng-minlength="3"\n                 required=""/>\n          <p class="help-block"\n             ng-show="form.confirmPassword.$error.match && vm.submitted">\n            Passwords must match.\n          </p>\n\n        </div>\n\n        <p class="help-block"> {{ vm.message }} </p>\n\n        <button class="btn btn-lg btn-primary" type="submit">Save changes</button>\n      </form>\n    </div>\n  </div>\n</div>\n')}]);