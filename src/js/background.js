// Check whether new version is installed


var app = angular.module('bgApp', ['ngStorage']);

var fetch = Promise.resolve();
var $ls;
var GA;

app.controller('bgCtrl', ['$scope', '$localStorage', 'util', 'stash', 'schedule', 'gaService',
    ($scope, $localStorage, util, stash, schedule, gaService) => {


        window.$ls = $scope.$ls = $ls = $localStorage;

        $ls.stashURL = 'https://stash.ironsrc.com';

        $ls.config = {
            hide_pr_with_tasks: false,
            scrum_master: false
        };

        GA = gaService;
        GA.pageview('/background');

        fetch = () => {
            return stash.prFetch().then(stash.prFetchMine);
        };
        fetch();

        schedule.scheduleDataFetch(fetch)

    }]);


/*


 var DEFAULT_INTERVAL = 120000;
 var MIN_INTERVAL = 10000;

 initSettings();

 chrome.runtime.onInstalled.addListener(function (details) {
 localStorage["_updated"] = moment(Date.now()).format("DD/MM/YY, HH:mm");
 if (details.reason == "install") {
 initSettings(true);
 console.log("First install");
 chrome.tabs.create({
 url: "/src/options_custom/index.html"
 });
 } else if (details.reason == "update") {
 var thisVersion = chrome.runtime.getManifest().version;
 console.log("Updated from " + details.previousVersion + " to " + thisVersion);
 }
 });

 function go() {

 function main() {
 return new Promise(function (resolve, reject) {
 if (!localStorage._refreshInterval.length > 5)
 localStorage._refreshInterval = DEFAULT_INTERVAL;
 return resolve();
 });
 }

 main()
 .then(getMyRequestsData)
 .then(getPullRequestData)
 .then(notifyPullRequests)
 .then(function () {
 chrome.runtime.sendMessage({loaded: true});
 // Schedule next time:
 setTimeout(go, Math.max(Number(localStorage._notifyInterval), MIN_INTERVAL) || DEFAULT_INTERVAL);
 return Promise.resolve()
 }).catch(errHandle);
 }

 go();*/
