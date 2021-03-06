function registerListener() {
    $(".menuItem").click(function (o) {
        return $(this).hasClass("selected") ? (o.preventDefault(), void 0) : ($(".menuItem.selected").removeClass("selected"), $(this).addClass("selected"), $(".tab.activeTab").removeClass("activeTab"), $("#" + $(this).attr("data-tab")).addClass("activeTab"), "multiDownloadsTab" == $(this).attr("data-tab") && initMultiDownloader(), void 0)
    })
}

$(document).ready(function () {
	try{
        if(document.location.hash){
    		$(".menuItem.selected").removeClass("selected"); 
    		$(".tab.activeTab").removeClass("activeTab");
    		$(document.location.hash+"Menu").addClass("selected");
    		$("#"+$(document.location.hash+"Menu").attr("data-tab")).addClass("activeTab");
        }
	} catch(e){
		console.log(e);
	}
    
    $("#animation").jqxSwitchButton({
        theme: "classic",
        width: "100",
        height: "30",
        checked: !localStorage.animation || localStorage.animation==="true"
    }), $("#animation").bind("checked", function () {
        localStorage.animation = "true";
    }), $("#animation").bind("unchecked", function () {
        localStorage.animation = "false";
    });


    void 0 === localStorage.allowGreybar && (localStorage.allowGreybar = "false"), void 0 === localStorage.notiications && (localStorage.notiications = "true");
    var o = "true" === localStorage.allowGreybar ? !0 : !1;
    $("#downloadBar").jqxSwitchButton({
        theme: "classic",
        width: "100",
        height: "30",
        checked: o
    }), $("#downloadBar").bind("checked", function () {
        localStorage.allowGreybar = "true", chrome.downloads.setShelfEnabled(!0)
    }), $("#downloadBar").bind("unchecked", function () {
        localStorage.allowGreybar = "false", chrome.downloads.setShelfEnabled(!1)
    });
    var e = "true" === localStorage.notiications ? !0 : !1;
    $("#notification").jqxSwitchButton({
        theme: "classic",
        width: "100",
        height: "30",
        checked: e
    }), $("#notification").bind("checked", function () {
        localStorage.notiications = "true"
    }), $("#notification").bind("unchecked", function () {
        localStorage.notiications = "false"
    })
}), window.onload = function () {

    // Hours Format
    if(localStorage.hours_format && localStorage.hours_format=="12hours"){
        $("#12hours").prop("checked", true);
    } else {
        $("#24hours").prop("checked", true);
        localStorage.hours_format="24hours";
    }

    $("#12hours").click(function () {
        localStorage.hours_format="12hours";
        chrome.runtime.sendMessage('hour_format');
    });
    $("#24hours").click(function () {
        localStorage.hours_format="24hours";
        chrome.runtime.sendMessage('hour_format');
    });

    // Icon Theme Format
    if(localStorage.iconTheme && localStorage.iconTheme=="light"){
        $("#icon_light").prop("checked", true);
    } else {
        $("#icon_dark").prop("checked", true);
        localStorage.iconTheme="dark";
    }

    $("#icon_light").click(function () {
        localStorage.iconTheme="light";
        chrome.runtime.sendMessage('theme');
    });
    $("#icon_dark").click(function () {
        localStorage.iconTheme="dark";
        chrome.runtime.sendMessage('theme');
    });

    // Theme Format
    if(localStorage.theme && localStorage.theme=="light"){
        $("#theme_light").prop("checked", true);
    } else {
        $("#theme_dark").prop("checked", true);
        localStorage.theme="dark";
    }

    $("#theme_light").click(function () {
        localStorage.theme="light";
        chrome.runtime.sendMessage('theme');
    });
    $("#theme_dark").click(function () {
        localStorage.theme="dark";
        chrome.runtime.sendMessage('theme');
    });

    void 0 === localStorage.notificationAction && (localStorage.notificationAction = "open-file"), "open-file" == localStorage.notificationAction ? $("#open-file").prop("checked", !0) : $("#open-folder").prop("checked", !0), $("#open-file").click(function () {
        localStorage.notificationAction = "open-file"
    }), $("#open-folder").click(function () {
        localStorage.notificationAction = "open-folder"
    }), registerListener(), "#help" == window.location.hash && $('[data-tab="helpTab"]').trigger("click"), "#settings" == window.location.hash && $('[data-tab="settingsTab"]').trigger("click"), document.getElementById("mShort").onclick = function () {
        chrome.tabs.create({
            url: "chrome://extensions/configureCommands"
        })
    }

    OpenFileNotWorking();
};


function OpenFileNotWorking(){
    try{
        document.getElementById('chrome-beta-link').onclick=function(){
            var p = document.getElementById('chrome-beta-text');
            if(p.style.display=='none') p.style.display='inline-block';
            else p.style.display='none';  
        }    

    }catch(e){}
}
