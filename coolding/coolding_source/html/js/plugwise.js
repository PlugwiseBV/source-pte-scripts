// Generated by CoffeeScript 1.9.2
(function() {
  var controller, myApp, services;

  angular.module('hardware', ['pascalprecht.translate', 'ngRoute', 'hardware.filters', 'hardware.services', 'hardware.controllers', 'hardware.directives', 'ngCookies', 'ngDragDrop', 'ui.bootstrap', 'ui.bootstrap.modal']).config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    return delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }).config(function($translateProvider) {
    return $translateProvider.useStaticFilesLoader({
      prefix: 'translation/',
      suffix: '.json'
    }).preferredLanguage('nl-NL').fallbackLanguage(['en-US']).useLocalStorage();
  }).config([
    '$routeProvider', function($routeProvider) {
      $routeProvider.when('/index/:id*', {
        name: 'Index',
        templateUrl: 'view/index.html'
      });
      $routeProvider.when('/index', {
        name: 'Index',
        templateUrl: 'view/index.html'
      });
      return $routeProvider.otherwise({
        redirectTo: '/index'
      });
    }
  ]).run([
    'JsonService', '$location', function(JsonService, $location) {
      if ($location.path() === '/index' || $location.path() === '') {
        return JsonService.serverRequests('../cache/last/last_connect.pte').then((function(fetch) {
          $location.path("/index/" + fetch.data.replace(/(\r\n|\n|\r)/gm, ""));
        }));
      }
    }
  ]);

  controller = angular.module('hardware.controllers', []);

  controller.controller('HardwareController', function() {}).controller('authenticated', [function() {}]);

  controller.controller('languageInit', [
    '$translate', '$scope', function($translate, $scope) {
      $scope.init = function() {
        return $scope.languageSelect = $translate.use();
      };
      $scope.init();
      return $scope.changeLanguage = function() {
        console.log($translate.use());
        if ($translate.use() !== $scope.changedLanguageIn) {
          return $translate.use($scope.changedLanguageIn);
        }
      };
    }
  ]).controller('HardwareLogin', [
    '$scope', '$http', 'JsonService', '$filter', '$rootScope', '$location', 'AuthenticationsService', '$q', "logoutButton", function($scope, $http, JsonService, $filter, $rootScope, $location, AuthenticationsService, $q, logoutButton) {
      return $scope.login = function() {
        AuthenticationsService.ClearCredentials();
        AuthenticationsService.AddBasicAuth($scope.username, $scope.password);
        return AuthenticationsService.Status(function(callback) {
          if (callback.loggedin === true) {
            AuthenticationsService.SetCredentials($scope.username, $scope.password);
            logoutButton.showButton();
            $location.path("/index");
          }
          if (callback.loggedin === false) {
            $scope.errorMessage = true;
            return $scope.errorMessageBody = 'Your username and/or password is invalid. Please try again.';
          }
        });
      };
    }
  ]).controller('AddressIdentifier', [
    '$scope', '$location', '$http', 'JsonService', '$filter', '$route', 'regexValidate', '$timeout', '$window', function($scope, $location, $http, JsonService, $filter, $route, regexValidate, $timeout, $window) {
      $scope.valid = false;
      $scope.windowOpen = false;
      $scope.trigger = {
        'place': 'both'
      };
      $scope.runScript = function() {
        if ($scope.run === false) {
          $scope.run = true;
          return $scope.running();
        } else {
          return $scope.run = false;
        }
      };
      $scope.modifyexception = function(id) {
        var child, interval;
        if (!$scope.windowOpen) {
          $scope.windowOpen = true;
          child = $window.open("calendar.html?id=" + id, "_blank", "height=600,width=1000");
          return interval = setInterval(function() {
            try {
              (function() {
                if (child.document.domain === document.domain) {
                  return clearInterval(interval);
                }
              });
            } catch (_error) {}
            if (child.closed) {
              console.log("closed");
              clearInterval(interval);
              $scope.windowOpen = false;
            }
          }, 500);
        }
      };
      $scope.remove = function(id) {
        var deviceid, filename;
        console.log(id);
        filename = '';
        deviceid = '';
        angular.forEach($scope.history, function(v, k) {
          if (v.sedid != null) {
            if (v.sedid === id) {
              filename = v.filename;
              deviceid = v.sedid;
              $scope.history.splice(k, 1);
            }
          }
        });
        JsonService.serverRequests('../connect/save_coolding_setting.pte', 'POST', $scope.history).then((function(fetch) {}));
        return JsonService.serverRequests('../connect/coolding_editEvent.pte?filename=' + filename + '&id=' + deviceid + '&remove=true&status=false').then((function(fetch) {}));
      };
      $scope.turnOff = function(id, extraValue) {
        var deviceid, filename, status;
        filename = '';
        deviceid = '';
        status = false;
        angular.forEach($scope.history, function(v, k) {
          if (v.sedid != null) {
            if (v.sedid === id) {
              if (v.running === true) {
                $scope.history[k].running = false;
              } else {
                $scope.history[k].running = true;
              }
              status = $scope.history[k].running;
              filename = v.filename;
              deviceid = v.sedid;
            }
          }
        });
        JsonService.serverRequests('../connect/save_coolding_setting.pte', 'POST', $scope.history).then((function(fetch) {}));
        return JsonService.serverRequests('../connect/coolding_editEvent.pte?filename=' + filename + '&id=' + deviceid + '&extravalue=' + extraValue + '&status=' + status).then((function(fetch) {}));
      };
      $scope.reset = function() {
        $scope.list1 = '';
        $scope.list2 = '';
        $scope.list3 = '';
        $scope.list4 = '';
        $scope.list5 = '';
        console.log($scope);
        $scope.list1 = {};
        $scope.list2 = {};
        $scope.list3 = {};
        $scope.list4 = {};
        $scope.list5 = {};
        $scope.chosen_schedule = {};
        return console.log($scope);
      };
      $scope.schedules = '';
      $scope.loadAllSchedules = function() {
        return JsonService.serverRequests('../connect/schedules.pte').then((function(fetch) {
          return $scope.schedules = fetch.data;
        }));
      };
      $scope.loadSchedule = function(uuid) {
        $scope.schedule_loader = true;
        return JsonService.serverRequests('../connect/schedule_values.pte?uuid=' + uuid).then((function(fetch) {
          return $scope.schedule = fetch.data;
        }));
      };
      $scope.log = function() {
        var data, extraValue, filename, sedname;
        filename = Math.floor(Math.random() * 900000) + 10000;
        extraValue = '';
        if ($scope.list2.type === '3') {
          extraValue = $scope.trigger.place;
        }
        if ($scope.list2.type === '5') {
          extraValue = "Sense&upper_limit=" + $scope.upper_limit + "&lower_limit=" + $scope.lower_limit + "&schedule=" + $scope.chosen_schedule + "&eco_on=" + $scope.list4.id + "&eco_off=" + $scope.list5.id;
        }
        JsonService.serverRequests('../connect/coolding_writeScript.pte?id=' + $scope.identifier + '&device=' + $scope.list2.type + '&extra=' + extraValue + '&ip=' + $scope.ip + '&sequence_id=' + $scope.list1.id + '&sequence_id_off=' + $scope.list3.id + '&sed_id=' + $scope.list2.deviceid + '&name=' + filename, 'jsonp').then((function(fetch) {}));
        if ($scope.list2.id != null) {
          console.log("remove existing");
          console.log($scope.history);
          angular.forEach($scope.history, function(v, k) {
            console.log($scope.history);
            if (v.sedid != null) {
              if ($scope.list2.type === '3') {
                console.log("concat");
                console.log($scope.list2.type);
                console.log($scope.list2.id);
                console.log(v.sedid);
                if ($scope.trigger.place === 'right') {
                  if (v.sedid === $scope.list2.id + '_right') {
                    $scope.history.splice(k, 1);
                  }
                }
                if ($scope.trigger.place === 'left') {
                  if (v.sedid === $scope.list2.id + '_left') {
                    $scope.history.splice(k, 1);
                  }
                }
                if ($scope.trigger.place === 'both') {
                  if (v.sedid === $scope.list2.id + '_left') {
                    $scope.history.splice(k, 1);
                    console.log('after splice left');
                    console.log($scope.history);
                  }
                  if (v.sedid === $scope.list2.id + '_right') {
                    $scope.history.splice(k, 1);
                    console.log('after splice right');
                    return console.log($scope.history);
                  }
                }
              } else {
                if (v.sedid === $scope.list2.id) {
                  return $scope.history.splice(k, 1);
                }
              }
            }
          });
          if ($scope.list2.title != null) {
            sedname = $scope.list2.title;
          } else {
            sedname = 'No name';
          }
          if ($scope.list2.type === '3') {
            if ($scope.trigger.place === 'both') {
              data = [
                {
                  "filename": filename,
                  "running": true,
                  "extravalue": "right",
                  "command1": $scope.list1.id,
                  "commandname1": $scope.list1.title,
                  "command2": $scope.list3.id,
                  "commandname2": $scope.list3.title,
                  "seddeviceid": $scope.list2.deviceid,
                  "sedid": $scope.list2.id + "_right",
                  "sedname": sedname
                }, {
                  "filename": filename,
                  "running": true,
                  "extravalue": "left",
                  "command1": $scope.list1.id,
                  "commandname1": $scope.list1.title,
                  "command2": $scope.list3.id,
                  "commandname2": $scope.list3.title,
                  "seddeviceid": $scope.list2.deviceid,
                  "sedid": $scope.list2.id + "_left",
                  "sedname": sedname
                }
              ];
            } else {
              data = [
                {
                  "filename": filename,
                  "running": true,
                  "extravalue": $scope.trigger.place,
                  "command1": $scope.list1.id,
                  "commandname1": $scope.list1.title,
                  "command2": $scope.list3.id,
                  "commandname2": $scope.list3.title,
                  "seddeviceid": $scope.list2.deviceid,
                  "sedid": $scope.list2.id + "_" + $scope.trigger.place,
                  "sedname": sedname
                }
              ];
            }
          } else if ($scope.list2.type === '5') {
            data = [
              {
                "filename": filename,
                "running": true,
                "command1": $scope.list1.id,
                "commandname1": $scope.list1.title,
                "command2": $scope.list3.id,
                "commandname2": $scope.list3.title,
                "command3": $scope.list4.id,
                "commandname3": $scope.list4.title,
                "command4": $scope.list5.id,
                "commandname4": $scope.list5.title,
                "upper_limit": $scope.upper_limit,
                "lower_limit": $scope.lower_limit,
                "schedule": $scope.chosen_schedule,
                "seddeviceid": $scope.list2.deviceid,
                "sedid": $scope.list2.id,
                "sedname": sedname
              }
            ];
          } else {
            data = [
              {
                "filename": filename,
                "running": true,
                "command1": $scope.list1.id,
                "commandname1": $scope.list1.title,
                "command2": $scope.list3.id,
                "commandname2": $scope.list3.title,
                "seddeviceid": $scope.list2.deviceid,
                "sedid": $scope.list2.id,
                "sedname": sedname
              }
            ];
          }
          console.log(data);
          if ($scope.history != null) {
            $scope.history = $scope.history.concat(data);
          } else {
            $scope.history = data;
          }
          console.log("history");
          console.log($scope.history);
          return JsonService.serverRequests('../connect/save_coolding_setting.pte', 'POST', $scope.history).then((function(fetch) {}));
        }
      };
      $scope.emptyList = function(id) {
        console.log('remove');
        console.log(id);
        if (id === 1) {
          $scope.list1 = '';
          $scope.list1 = {};
        }
        if (id === 2) {
          $scope.list2 = '';
          $scope.list2 = {};
          $scope.list4 = '';
          $scope.list4 = {};
          $scope.list5 = '';
          $scope.list5 = {};
        }
        if (id === 3) {
          $scope.list3 = '';
          $scope.list3 = {};
        }
        if (id === 4) {
          $scope.list4 = '';
          $scope.list4 = {};
        }
        if (id === 5) {
          $scope.list5 = '';
          return $scope.list5 = {};
        }
      };
      $scope.placeSed = function(id, type, title, deviceid) {
        console.log(id);
        $scope.list2.id = id;
        $scope.list2.type = type;
        $scope.list2.title = title;
        return $scope.list2.deviceid = deviceid;
      };
      $scope.placeCooldingcom = function(id, title) {
        var open;
        open = false;
        if ($scope.list1.id == null) {
          open = true;
          $scope.list1.id = id;
          $scope.list1.title = title;
        }
        if (($scope.list3.id == null) && !open) {
          open = true;
          $scope.list3.id = id;
          $scope.list3.title = title;
        }
        if ($scope.list2.type === '5') {
          if (($scope.list4.id == null) && !open) {
            open = true;
            $scope.list4.id = id;
            $scope.list4.title = title;
          }
          if (($scope.list5.id == null) && !open) {
            open = true;
            $scope.list5.id = id;
            return $scope.list5.title = title;
          }
        }
      };
      $scope.load_sed = function(sed) {
        var sed_id;
        $scope.sed_loading = true;
        sed_id = 6;
        if (sed === 'switch') {
          sed_id = 3;
        }
        if (sed === 'scan') {
          sed_id = 6;
        }
        if (sed === 'sense') {
          sed_id = 5;
        }
        return JsonService.serverRequests('../connect/modules_json.pte?module=' + sed_id).then((function(fetch) {
          return JsonService.serverRequests('../cache/modules.json').then((function(fetch) {
            $scope.loader_status = false;
            $scope.button_status = false;
            $scope.error_status = false;
            $scope.sed_loading = false;
            $scope.devices.statuses = fetch.data;
            $scope.devices.statuses.show = true;
          }), function(reason) {
            $scope.loader_status = true;
            $scope.button_status = true;
            $scope.error_status = true;
          });
        }));
      };
      $scope.sendCooldingCommand = function(command) {
        return JsonService.serverRequests('../connect/sendcooldingcommand.pte?command=' + command + '&id=' + $scope.identifier + '&ip=' + $scope.ip).then((function(result) {}), function(reason) {});
      };
      $scope.cooldingSequence = function(identifier) {
        $scope.reload = 'Loading...';
        return $.get('../connect/coolding_sequences.pte?ip=' + $scope.ip + '&id=' + identifier, function(xmls) {
          if (xmls === 'ok') {
            JsonService.serverRequests('../cache/coolding_sequences.xml').then((function(xmll) {
              var jsonn;
              $scope.loader_current = false;
              $scope.error_current = false;
              if (xmll != null) {
                jsonn = $.xml2json(xmll.data);
                $scope.devices.current = jsonn.sequences;
                console.log("current:");
                console.log($scope.devices.current);
                if ($scope.devices.current != null) {
                  $scope.devices.current.show = true;
                }
                $scope.reload = 'Reload';
              }
            }), function(reason) {});
          } else {
            if ($scope.ip === $scope.wifiip) {
              if ($scope.lanip != null) {
                $scope.ip = $scope.lanip;
                $scope.cooldingSequence(identifier);
              }
            } else {
              if ($scope.wifiip != null) {
                $scope.ip = $scope.wifiip;
                $scope.cooldingSequence(identifier);
              }
            }
          }
        });
      };
      $scope.cooldingInfo = function(identifier) {
        console.log('identifier - coolding info');
        console.log($scope.ip);
        return $.get('../connect/coolding_info.pte?ip=' + $scope.ip + '&id=' + identifier, function(xml) {
          if (xml === 'ok') {
            JsonService.serverRequests('../cache/coolding_info.xml').then((function(xmll) {
              var json;
              console.log(xmll);
              if (xmll != null) {
                json = $.xml2json(xmll.data);
                $scope.coolding_name = json.info;
              }
            }), function(reason) {});
          } else {
            if ($scope.ip === $scope.wifiip) {
              if ($scope.lanip != null) {
                $scope.ip = $scope.lanip;
                $scope.cooldingInfo(identifier);
              }
            } else {
              if ($scope.wifiip != null) {
                $scope.ip = $scope.wifiip;
                $scope.cooldingInfo(identifier);
              }
            }
          }
        });
      };
      $scope.request = function(identifier) {
        var devices;
        if (identifier === void 0) {
          console.log('stop');
          return;
        }
        if ($location.path() !== '/index/' + identifier) {
          $location.path('/index/' + identifier);
          return;
        }
        $scope.devices = {};
        if (identifier == null) {
          $scope.devices.error = true;
          return $scope.error_message = "The MAC-address, UUID or shortid can not be empty.";
        } else {
          if (!$scope.valid) {
            $scope.devices.error = true;
            return $scope.error_message = "The MAC-address, UUID or shortid is not valid.";
          } else {
            identifier = identifier.toLowerCase();
            $scope.identifier = identifier;
            if (identifier.toUpperCase().match(/^([0-9A-F]{12})$/)) {
              identifier = identifier.replace(/(.)(.)(?!$)/g, '$1$2:');
            }
            devices = function(callback) {
              JsonService.serverRequests('https://smile.plugwise.net/?json=true&callback=JSON_CALLBACK&shortId=' + identifier, 'jsonp').then((function(fetch) {
                var lan_ip;
                lan_ip = '';
                if ((fetch.data.lan_ip != null)) {
                  lan_ip = Object.keys(fetch.data.lan_ip);
                }
                if (lan_ip.length === 0) {
                  $scope.ip = fetch.data.wifi_ip;
                  $scope.wifiip = fetch.data.wifi_ip;
                } else {
                  $scope.ip = fetch.data.lan_ip;
                  if ((fetch.data.lan_ip != null)) {
                    $scope.wifiip = fetch.data.wifi_ip;
                  }
                  $scope.lanip = fetch.data.lan_ip;
                }
                $scope.loader_device = false;
                $scope.error_device = false;
                JsonService.serverRequests('../connect/plugincheck.pte').then((function(plugin) {
                  if (plugin.data === 'true') {
                    $scope.devices.show = true;
                    $scope.devices.devices = fetch.data;
                    return callback(true);
                  } else {
                    $scope.loader_device = false;
                    $scope.error_device = true;
                    $scope.devices.error = true;
                    $scope.error_message = '';
                    $scope.license_missing = true;
                    return callback(false);
                  }
                }));
                return callback(false);
              }), function(reason) {
                $scope.devices.show = false;
                $scope.loader_device = false;
                $scope.error_device = true;
                $scope.devices.error = true;
                $scope.error_message = "The MAC-address, UUID or shortid can not be found. This could be due to a problem with your Internet connection.";
                return callback(false);
              });
              return callback(false);
            };
            return devices((function(_this) {
              return function(found) {
                var orderBy;
                if (found) {
                  $scope.loader_current = true;
                  $scope.loader_status = true;
                  $scope.button_status = true;
                  orderBy = $filter('orderBy');
                  $scope.error_current = false;
                  $scope.list4 = {};
                  $scope.list5 = {};
                  $scope.list3 = {};
                  $scope.list2 = {};
                  $scope.list1 = {};
                  $scope.lower_limit = 0;
                  $scope.upper_limit = 0;
                  $scope.chosen_schedule = {};
                  $.get('../cache/coolding_setting.json', function(settings) {
                    $scope.history = angular.fromJson(settings);
                    console.log($scope.history);
                  });
                  JsonService.serverRequests('../connect/schedules.pte').then((function(fetch) {
                    $scope.schedules = fetch.data;
                    return $scope.chosen_schedule = $scope.schedules[0].uuid;
                  }));
                  JsonService.serverRequests('../connect/modules_json.pte').then((function(fetch) {
                    return JsonService.serverRequests('../cache/modules.json').then((function(fetch) {
                      $scope.loader_status = false;
                      $scope.button_status = false;
                      $scope.error_status = false;
                      $scope.sed_loading = false;
                      $scope.devices.statuses = fetch.data;
                      $scope.devices.statuses.show = true;
                    }), function(reason) {
                      $scope.loader_status = true;
                      $scope.button_status = true;
                      $scope.error_status = true;
                    });
                  }));
                  $scope.show_last = false;
                  $scope.cooldingInfo(identifier);
                  $scope.cooldingSequence(identifier);
                  $scope.order = function(predicate, reverse) {
                    if (predicate === 'last_only') {
                      if ($scope.show_last === false) {
                        $scope.show_last = true;
                        $scope.devices.backup_statuses = $scope.devices.statuses;
                        $scope.devices.statuses = $filter('filterLast')($scope.devices.statuses);
                        $scope.devices.statuses = orderBy($scope.devices.statuses, 'created_date', true);
                        $scope.orderType = 'date';
                        $scope.reverse = true;
                      } else {
                        $scope.show_last = false;
                        $scope.devices.statuses = $scope.devices.backup_statuses;
                      }
                    }
                    $scope.preOrder = predicate;
                    $scope.devices.statuses = orderBy($scope.devices.statuses, predicate, reverse);
                    return $scope.devices.statuses.show = true;
                  };
                  $scope.preOrder = 'name';
                  return $scope.orderByType = function() {
                    if ($scope.preOrder === "name") {
                      $scope.preOrder = 'created_date';
                      return $scope.active = true;
                    } else {
                      $scope.preOrder = 'name';
                      return $scope.active = false;
                    }
                  };
                }
              };
            })(this));
          }
        }
      };
      if ($route.current.params.id != null) {
        $scope.identifier = $route.current.params.id;
        if (regexValidate.checkAll($route.current.params.id)) {
          $location.path('/index/' + $route.current.params.id);
          $scope.valid = true;
          return $scope.request($route.current.params.id);
        }
      }
    }
  ]);

  myApp = angular.module('hardware.directives', []).directive('addressBar', function() {
    return {
      restrict: "A",
      templateUrl: 'view/blocks/address.html'
    };
  }).directive('cooldingInfo', function() {
    return {
      restrict: "A",
      templateUrl: 'view/blocks/coolding-info.html'
    };
  }).directive('changeLanguage', function() {
    return function(scope, element, attrs) {
      return element.bind('click', function() {
        scope.changedLanguageIn = attrs.data;
        return scope.$apply("changeLanguage()");
      });
    };
  }).directive('cooldingRecords', function() {
    return {
      restrict: "A",
      templateUrl: 'view/blocks/coolding-records.html'
    };
  }).directive('historyBlock', function() {
    return {
      restrict: "A",
      templateUrl: 'view/blocks/history.html'
    };
  }).directive('loadSeds', function() {
    return {
      restrict: "A",
      templateUrl: 'view/blocks/load-seds.html'
    };
  }).directive('dragDrop', function() {
    return {
      restrict: "A",
      templateUrl: 'view/blocks/drag-drop.html'
    };
  }).directive('logoutButton', function() {
    return {};
  }).directive('checkValidid', [
    'regexValidate', function(regexValidate) {
      return function(scope, element) {
        ({
          restrict: "A"
        });
        return element.on('keyup', function(e) {
          scope.$apply(function() {
            return scope.valid = false;
          });
          if (regexValidate.checkAll(e.currentTarget.value)) {
            scope.$apply(function() {
              return scope.valid = true;
            });
          }
          if (e.keyCode === 13) {
            return scope.$apply(function() {
              return scope.request(e.currentTarget.value);
            });
          }
        });
      };
    }
  ]);

  angular.module('hardware.filters', []).filter("momentjs", function() {
    return function(val) {
      return moment(val).format('llll');
    };
  }).filter("tohtml", function($sce) {
    return function(val) {
      if (val != null) {
        console.log(val);
        return $sce.trustAsHtml(val);
      } else {
        return $sce.trustAsHtml('');
      }
    };
  }).filter("shortenid", function() {
    return function(val) {
      return val.substring(0, 8) + '..';
    };
  }).filter("getaddress", function() {
    return function(val) {
      return val.substring(8);
    };
  }).filter("filterLast", function() {
    return function(a) {
      var b, d, e, id, j, len, v;
      v = [];
      d = {};
      for (j = 0, len = a.length; j < len; j++) {
        b = a[j];
        if (d[b.type] != null) {
          if (!moment(d[b.type].created_date).isAfter(b.created_date)) {
            d[b.type] = {
              type: b.type,
              description: b.description,
              created_date: b.created_date
            };
          }
        } else {
          d[b.type] = {
            type: b.type,
            description: b.description,
            created_date: b.created_date
          };
        }
      }
      for (id in d) {
        e = d[id];
        v.push(e);
      }
      return v;
    };
  }).factory("regexValidate", function() {
    this.shortid = (function(_this) {
      return function(v) {
        if (v.toLowerCase().match(/^[b-df-hj-np-tv-xz]{8}$/)) {
          return true;
        }
        return false;
      };
    })(this);
    this.checkAll = (function(_this) {
      return function(v) {
        if (_this.shortid(v)) {
          return true;
        }
        return false;
      };
    })(this);
    return this;
  }).factory("logoutButton", [
    "$rootScope", function($rootScope) {
      this.logoutButton = true;
      this.showButton = (function(_this) {
        return function() {
          return _this.logoutButton = true;
        };
      })(this);
      this.hideButton = (function(_this) {
        return function() {
          return _this.logoutButton = false;
        };
      })(this);
      this.GetStatus = (function(_this) {
        return function() {
          return _this.logoutButton;
        };
      })(this);
      return this;
    }
  ]).factory("Base64", function() {
    var keyStr;
    keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    return {
      encode: function(input) {
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4, i, output;
        output = "";
        chr1 = void 0;
        chr2 = void 0;
        chr3 = "";
        enc1 = void 0;
        enc2 = void 0;
        enc3 = void 0;
        enc4 = "";
        i = 0;
        while (true) {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;
          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else {
            if (isNaN(chr3)) {
              enc4 = 64;
            }
          }
          output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";
          if (!(i < input.length)) {
            break;
          }
        }
        return output;
      },
      decode: function(input) {
        var base64test, chr1, chr2, chr3, enc1, enc2, enc3, enc4, i, output;
        output = "";
        chr1 = void 0;
        chr2 = void 0;
        chr3 = "";
        enc1 = void 0;
        enc2 = void 0;
        enc3 = void 0;
        enc4 = "";
        i = 0;
        base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
          window.alert("There were invalid base64 characters in the input text.\n" + "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" + "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (true) {
          enc1 = keyStr.indexOf(input.charAt(i++));
          enc2 = keyStr.indexOf(input.charAt(i++));
          enc3 = keyStr.indexOf(input.charAt(i++));
          enc4 = keyStr.indexOf(input.charAt(i++));
          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;
          output = output + String.fromCharCode(chr1);
          if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
          }
          if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
          }
          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";
          if (!(i < input.length)) {
            break;
          }
        }
        return output;
      }
    };
  });

  "use strict";

  services = angular.module('hardware.services', []);

  services.service("JsonService", [
    "$http", "$q", "$rootScope", function($http, $q, $rootScope) {
      var PLUGWISECLOUD, headers;
      PLUGWISECLOUD = "";
      headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      this.serverRequests = function(url, method, data, server) {
        var deferred;
        if (method == null) {
          method = 'GET';
        }
        if (data == null) {
          data = {};
        }
        if (server == null) {
          server = PLUGWISECLOUD;
        }
        deferred = $q.defer();
        if (method === 'jsonp') {
          return $http.jsonp(url).success(function(json) {
            deferred.resolve(json.data);
          }).error(function(err) {
            deferred.reject(err);
            return deferred.promise;
          });
        } else {
          return $http({
            headers: headers,
            url: url,
            method: method,
            dataType: 'json',
            data: data
          }).success(function(json) {
            deferred.resolve(json.data);
          }).error(function(err) {
            deferred.reject(err);
            return deferred.promise;
          });
        }
      };
      return this;
    }
  ]).service("AuthenticationsService", [
    "$http", "Base64", "$rootScope", "$cookieStore", "JsonService", "$location", function($http, Base64, $rootScope, $cookieStore, JsonService, $location) {
      var service;
      service = {};
      this.AddBasicAuth = function(username, password) {
        return $http.defaults.headers.common["Authorization"] = "Basic " + Base64.encode(username + ":" + password);
      };
      this.Status = function(callback) {
        JsonService.serverRequests('').then(((function(_this) {
          return function(fetch) {
            return callback({
              'loggedin': true
            });
          };
        })(this)), function(reason) {
          return callback({
            'loggedin': false
          });
        });
      };
      this.TryConnection = function(username, password, callback) {
        JsonService.serverRequests('').then(((function(_this) {
          return function(fetch) {
            _this.SetCredentials(username, password);
            $location.path("/index");
            return callback({
              'loggedin': true
            });
          };
        })(this)), function(reason) {
          callback("401");
          return {
            'loggedin': false
          };
        });
      };
      this.SetCredentials = function(username, password) {
        this.AddBasicAuth(username, password);
        $rootScope.globals = {
          currentUser: {
            username: username,
            authdata: Base64.encode(username + ":" + password)
          }
        };
        $cookieStore.put("globals", $rootScope.globals);
      };
      this.ClearCredentials = function() {
        $rootScope.globals = {};
        $cookieStore.remove("globals");
        $http.defaults.headers.common.Authorization = "Basic ";
      };
      return this;
    }
  ]);

}).call(this);
