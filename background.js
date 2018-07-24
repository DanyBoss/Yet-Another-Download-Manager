
// Enable Disable chrome download bar.
if (localStorage.allowGreybar === "true"){
	chrome.downloads.setShelfEnabled(true);
}
else {
	chrome.downloads.setShelfEnabled(false);
}

// Icon  & Theme Colors
var lightIconColors = {
	progressColor: '#0d0',
	arrow: '#fff',
	danger: 'red',
	complete: '#8FED24',
	paused: 'grey',
	background: 'white',
	progressBar: '#ddd',
	timeLeft: '#fff',
}

var darkIconColors = {
	progressColor: '#0d0',
	arrow: '#333',
	danger: 'red',
	complete: '#8FED24',
	paused: 'grey',
	background: 'white',
	progressBar: '#ddd',
	timeLeft: '#444',
}

var activeIconColor;
setIconColors();

function setIconColors() {
	if (localStorage.iconTheme == "light") {
		activeIconColor = lightIconColors;
	} else {
		activeIconColor = darkIconColors;
	}
	setBrowserActionIcon('n', '');
}

// Aplication Theme
var darkAppColors = {
	background: '#505050',
	textColor: '#fff',
}

var lightAppColors = {
	background: '#fff',
	textColor: '#000',
}

// Hour Format
var hours_format;
setHourFormat();

function setHourFormat() {
	if(localStorage.hours_format == '12hours'){
		hours_format = "12hours";
	} else {
		hours_format = "24hours";
	}
}

// Drawing Functions
function drawLine(ctx, x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}


function drawProgressSpinner(ctx, stage, color) {
	var center = ctx.canvas.width / 2;
	var radius = center * 0.9;
	const segments = 16;
	var segArc = 2 * Math.PI / segments;
	ctx.lineWidth = Math.round(ctx.canvas.width * 0.1);

	var total_width = ctx.canvas.width;
	var y = ctx.canvas.height - 7;

	ctx.fillStyle = color;
	var fill_width = (stage * total_width) / 16;
	ctx.fillRect(0, y, fill_width, 6);

	ctx.fillStyle = activeIconColor.progressBar;
	ctx.fillRect(fill_width, y, total_width - fill_width, 6);
}

function drawTimeLeft(ctx) {
	ctx.fillStyle = activeIconColor.timeLeft;
	ctx.font = "9px 'Open Sans'";
	ctx.fillText(formatTimeLeft(maxTimeLeftInMs), 0, 8);
}

function drawArrow(ctx, color) {
	ctx.beginPath();
	ctx.lineWidth = Math.round(ctx.canvas.width * 0.15);
	ctx.lineJoin = 'round';
	ctx.strokeStyle = ctx.fillStyle = color;
	var center = ctx.canvas.width / 2;
	var minw2 = center * 0.20;
	var maxw2 = center * 0.60;
	var height2 = maxw2 + 1;
	ctx.moveTo(center - minw2, center - height2);
	ctx.lineTo(center + minw2, center - height2);
	ctx.lineTo(center + minw2, center);
	ctx.lineTo(center + maxw2, center);
	ctx.lineTo(center, center + height2);
	ctx.lineTo(center - maxw2, center);
	ctx.lineTo(center - minw2, center);
	ctx.lineTo(center - minw2, center - height2);
	ctx.lineTo(center + minw2, center - height2);
	ctx.stroke();
	ctx.fill();
}

function drawDangerBadge(ctx) {
	let s = ctx.canvas.width / 100;
	ctx.fillStyle = color.danger;
	ctx.strokeStyle = activeIconColor.background;
	ctx.lineWidth = Math.round(s * 5);

	let edge = ctx.canvas.width - ctx.lineWidth;
	ctx.beginPath();
	ctx.moveTo(s * 75, s * 55);
	ctx.lineTo(edge, edge);
	ctx.lineTo(s * 55, edge);
	ctx.lineTo(s * 75, s * 55);
	ctx.lineTo(edge, edge);
	ctx.fill();
	ctx.stroke();
}

function drawPausedBadge(ctx) {
	let s = ctx.canvas.width / 100;
	ctx.beginPath();
	ctx.strokeStyle = activeIconColor.background;
	ctx.lineWidth = Math.round(s * 5);
	ctx.rect(s * 30, s * 5, s * 15, s * 45);
	ctx.fillStyle = activeIconColor.paused;
	ctx.fill();
	ctx.stroke();
	ctx.rect(s * 50, s * 5, s * 15, s * 45);
	ctx.fill();
	ctx.stroke();
}

function drawCompleteBadge(ctx) {
	let s = ctx.canvas.width / 100;
	ctx.beginPath();
	ctx.arc(s * 75, s * 75, s * 15, 0, 2 * Math.PI, false);
	ctx.fillStyle = activeIconColor.complete;
	ctx.fill();
	ctx.strokeStyle = activeIconColor.background;
	ctx.lineWidth = Math.round(s * 5);
	ctx.stroke();
}

function drawIcon(side, stage, badge) {

	let canvas = document.createElement('canvas');
	canvas.width = canvas.height = side;
	document.body.appendChild(canvas);
	var ctx = canvas.getContext('2d');

	if (stage == 'n') {
		drawArrow(ctx, activeIconColor.arrow);
	}

	if (stage != 'n' && badge != 'p' && badge != 'd') {
		drawProgressSpinner(ctx, stage, activeIconColor.complete);
		drawTimeLeft(ctx);
	}

	if (badge == 'd') {
		drawArrow(ctx, activeIconColor.danger);
		drawDangerBadge(ctx);
	} else if (badge == 'p') {
		drawProgressSpinner(ctx, stage, 'yellow');
		drawPausedBadge(ctx);
	} else if (badge == 'c') {
		drawArrow(ctx, activeIconColor.complete);
	}
	return canvas;
}

var maxTimeLeftInMs = 0;

function formatTimeLeft(ms) {
	if (ms < 1000) {
		return '0s';
	}
	var days = parseInt(ms / (24 * 60 * 60 * 1000));
	var hours = parseInt(ms / (60 * 60 * 1000)) % 24;
	if (days) {
		return days + 'd';
	}
	var minutes = parseInt(ms / (60 * 1000)) % 60;
	if (hours) {
		return hours + 'h';
	}
	var seconds = parseInt(ms / 1000) % 60;
	if (minutes) {
		return minutes + 'm';
	}
	return seconds + 's';
}

function setTimeLeft(ms) {
	if (ms > maxTimeLeftInMs) {
		maxTimeLeftInMs = ms;
	}
}

function maybeOpen(id) {
	var openWhenComplete = [];
	try {
		openWhenComplete = JSON.parse(localStorage.openWhenComplete);
	} catch (e) {
		localStorage.openWhenComplete = JSON.stringify(openWhenComplete);
	}
	var openNowIndex = openWhenComplete.indexOf(id);
	if (openNowIndex >= 0) {
		chrome.downloads.open(id);
		openWhenComplete.splice(openNowIndex, 1);
		localStorage.openWhenComplete = JSON.stringify(openWhenComplete);
	}
}

function setBrowserActionIcon(stage, badge) {

	var canvas1 = drawIcon(16, stage, badge);
	var canvas2 = drawIcon(32, stage, badge);
	var imageData = {};
	imageData['' + canvas1.width] = canvas1.getContext('2d').getImageData(
		0, 0, canvas1.width, canvas1.height);
	imageData['' + canvas2.width] = canvas2.getContext('2d').getImageData(
		0, 0, canvas2.width, canvas2.height);
	chrome.browserAction.setIcon({
		imageData: imageData
	});
	canvas1.parentNode.removeChild(canvas1);
	canvas2.parentNode.removeChild(canvas2);
}

function pollProgress() {

	pollProgress.tid = -1;

	chrome.downloads.search({}, function (items) {
		var popupLastOpened = parseInt(localStorage.popupLastOpened);
		var totalTotalBytes = 0;
		var totalBytesReceived = 0;
		var anyMissingTotalBytes = false;
		var anyDangerous = false;
		var anyPaused = false;
		var anyRecentlyCompleted = false;
		var anyInProgress = false;
		maxTimeLeftInMs = 0;
		items.forEach(function (item) {
			if (item.state == 'in_progress') {
				anyInProgress = true;

				setTimeLeft(new Date(item.estimatedEndTime).getTime() - new Date().getTime());
				if (item.totalBytes) {
					totalTotalBytes += item.totalBytes;
					totalBytesReceived += item.bytesReceived;
				} else {
					anyMissingTotalBytes = true;
				}
				var dangerous = ((item.danger != 'safe') &&
					(item.danger != 'accepted'));
				anyDangerous = anyDangerous || dangerous;
				anyPaused = anyPaused || item.paused;
			} else if ((item.state == 'complete') && item.endTime && !item.error) {

				var ended = (new Date(item.endTime)).getTime();
				var recentlyCompleted = (ended >= popupLastOpened);
				var showNoti = true;
				if (localStorage.notiications === "false")
					showNoti = false;
				if (recentlyCompleted && showNoti) showNotification(item);
				anyRecentlyCompleted = anyRecentlyCompleted || recentlyCompleted;
				maybeOpen(item.id);
			}
		});
		var stage = !anyInProgress ? 'n' : (anyMissingTotalBytes ? 'm' :
			parseInt((totalBytesReceived / totalTotalBytes) * 15) + 1);
		var badge = anyDangerous ? 'd' : (anyPaused ? 'p' :
			(anyRecentlyCompleted ? 'c' : ''));

		setBrowserActionIcon(stage, badge);

		if (anyInProgress &&
			(pollProgress.tid < 0)) {
			pollProgress.start();
		}
	});
}
pollProgress.tid = -1;
pollProgress.MS = 200;

pollProgress.start = function () {
	if (pollProgress.tid < 0) {
		pollProgress.tid = setTimeout(pollProgress, pollProgress.MS);
	}
};

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

if (!isNumber(localStorage.popupLastOpened)) {
	localStorage.popupLastOpened = '' + (new Date()).getTime();
}

chrome.downloads.onCreated.addListener(function (item) {
	pollProgress();
});

pollProgress();

function openWhenComplete(downloadId) {
	var ids = [];
	try {
		ids = JSON.parse(localStorage.openWhenComplete);
	} catch (e) {
		localStorage.openWhenComplete = JSON.stringify(ids);
	}
	pollProgress.start();
	if (ids.indexOf(downloadId) >= 0) {
		return;
	}
	ids.push(downloadId);
	localStorage.openWhenComplete = JSON.stringify(ids);
}

function showNotification(item) {
	item.basename = item.filename.substring(Math.max(
		item.filename.lastIndexOf('\\'),
		item.filename.lastIndexOf('/')) + 1);
	if (item.basename.length > 50) {
		item.basename = item.basename.substr(0, 40) + "..." + item.basename.substr(item.basename.length - 7, item.basename.length);
	}

	chrome.downloads.getFileIcon(
		item.id, {
			'size': 32
		},
		function (icon_url) {
			var icon = "down-arrow16.png"
			if (icon_url !== undefined) icon = icon_url;
			var opt = {
				type: "basic",
				title: item.basename,
				message: "Download Complete!",
				eventTime: Date.now() + 5000,
				iconUrl: "down-arrow128.png"
			}

			chrome.notifications.create("" + item.id, opt, function (id) {
				setTimeout(function () {
					chrome.notifications.clear(id, function (wasCleared) {});
				}, 5000);
			});

		});
}

chrome.downloads.onChanged.addListener(function (e) {
	if (e.filename && e.filename.previous == '') {
		//console.log(localStorage.animation);
		if (!localStorage.animation || localStorage.animation === "true") {
			sendAnimMsg('safe');
		}
	}
	if (e.danger && e.danger.current != 'safe') {
		console.log('download not safe ' + e.id)
		sendAnimMsg('danger');
	}
});

function sendAnimMsg(msg) {
	console.log('sending msg');
	chrome.tabs.query({
		active: true
	}, function (tabs) {
		tabs.forEach(function (tab) {
			chrome.tabs.sendMessage(tab.id, msg);
			console.log('msg send');
		})
	})
}

chrome.notifications.onClicked.addListener(function (itemId) {
	if (localStorage.notificationAction == "open-folder") {
		chrome.downloads.show(parseInt(itemId));
	} else {
		chrome.downloads.open(parseInt(itemId));
	}
	chrome.notifications.clear(itemId, function (wasCleared) {});
	localStorage.popupLastOpened = Date.now();
});

chrome.notifications.onClosed.addListener(function (notificationId, byUser) {
	//chrome.notifications.clear(notificationId, function(wasCleared){} );
	localStorage.popupLastOpened = Date.now();
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request == 'theme') {
		setIconColors();
		return;
	} else if(request == 'hours_format'){
		setHourFormat();
		return;
	} else if (request == 'poll') {
		pollProgress.start();
	} else if (request == 'icons') {
		[16, 32, 128].forEach(function (s) {
			var canvas = drawIcon(s, 'n', '');
			chrome.downloads.download({
				url: canvas.toDataURL('image/png', 1.0),
				filename: 'down-arrow' + s + '.png',
			});
			canvas.parentNode.removeChild(canvas);
		});
	} else if (isNumber(request.openWhenComplete)) {
		openWhenComplete(request.openWhenComplete);
	}
	try {
		if (request.method == "getStorage") {
			sendResponse({
				data: localStorage[request.key]
			});
		} else if (request.method == "setStorage") {
			localStorage[request.key] = request.value;
			sendResponse({});
		}
	} catch (e) {}

});