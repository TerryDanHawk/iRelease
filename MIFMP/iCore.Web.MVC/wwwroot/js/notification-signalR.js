var noti_connection = new signalR.HubConnectionBuilder().withUrl("/notificationHub").build();

noti_connection.on("RecieveNotification", function (originallist) {

     $("#notificationBody").empty();
    var cookie = $.cookie('userinfor');
    UserInfor = JSON.parse(cookie);
    if (UserInfor == null) return;
    var userId = UserInfor.UserId;
    var notiflist = [];
    for (var i = 0; i < originallist.length; i++) {
        if (originallist[i].recieveUserId == userId) {
            notiflist.push(originallist[i]);
        }
    }
    //更新统计
    var count = notiflist.length;
    if (count == 0) {
        $("#no_notification").show();
        $("#badge_notificationCount").hide();
        $("#badge_notificationCount").html(count);
        $("#title_notificationCount").html(count);
        $("#badge_notificationCount").hide();
        StopFlashBell();
    }
    else {
        $("#no_notification").hide();
        $("#badge_notificationCount").show();
        $("#badge_notificationCount").html(count);
        $("#title_notificationCount").html(count);
        $("#badge_notificationCount").show();
        StartFlashBell();
        //解析具体消息体
        
        for (var i = 0; i < notiflist.length; i++) {
            var msg = notiflist[i].message.replace(/'/g, "\'").replace(/"/g, "\"");
            var originalmsg = msg.replace(/'/g, "&qt;").replace(/"/g, "&pt;").replace(/\\/g, "&rt;").replace(/\//g, "&rt;");
            var url = notiflist[i].linkURL.replace(/'/g, "&qt;").replace(/"/g, "&pt;").replace(/\\/g, "&rt;").replace(/\//g,"&rt;");
            var cookie = $.cookie('languagecode');
            var splitmax = 45;
            if (cookie != null && cookie.toString().toLowerCase() == "zh-cn")
                splitmax = 23;
            if (msg.length > splitmax) {

                msg = msg.substring(0, splitmax) + "...";
            }

            var notihtml = String.format(

                '<a  href="#"  onclick=\"NotifiItemClick({0},\'{1}\',\'{5}\',\'{3}\',\'{4}\')\" class="dropdown-item">' +
                '<i class="fa fa-envelope mr-2"></i>{2}'+
                '<span class="float-right text-muted text-sm">{4} ago</span>' +
                '</a>' +
                '<div class="dropdown-divider"></div>'
                , notiflist[i].id, notiflist[i].sendSource, msg, url, notiflist[i].timeSpan, originalmsg
            );
            $("#notificationBody").append(notihtml);
        }


    }
});

noti_connection.start().catch(function (err) {
    return console.error(err.toString());
});

function NotifiItemClick(id, sendsource, message, linkurl, timespan) {
    //存储到本地
    var Notis = localStorage.getItem("Notifications");
    if (Notis == null) {
        Notis = [];
    }
    else {
        Notis = JSON.parse(Notis);
    }
    var flag = false;
    for (var i = 0; i < Notis.length; i++) {
        if (id.toString() == Notis[i].id.toString()) {
            flag = true;
        }
    }
    if (!flag) {
        Notis.push({ "id": id, "sendsource": sendsource, "message": message, "linkurl": linkurl, "timespan": getNowFormatDate() });
    }
    localStorage.setItem("Notifications", JSON.stringify(Notis));

    message = message.replace(/&qt;/g, "\'").replace(/&pt;/, "\"").replace(/&rt;/g, "\\").replace(/&rt;/g, "\/");
    linkurl = linkurl.replace(/&qt;/g, "\'").replace(/&pt;/, "\"").replace(/&rt;/g, "\\").replace(/&rt;/g, "\/");
    var body = "";
    if (linkurl == "") body = message
    else {
        body = "<a href='" + linkurl + "'>" + message + "</a><br/><br/><p style='text-align:right'>" + timespan+" ago</p>";
    }
    $.toast({
        heading: "from:" + sendsource,
        text: body,
        hideAfter: false,
        allowToastClose: true,
        showHideTransition: 'slide',
        position: 'bottom-right',
        stack: 5
    });

    var cookie = $.cookie('userinfor');
    UserInfor = JSON.parse(cookie);
    if (UserInfor == null) return;

    noti_connection.invoke("Read", id, UserInfor.UserId).catch(function (err) {
        return console.error(err.toString());
    });
}

noti_connection.on("Connected", function (connectionId) {

    GetNotification();

});

function GetNotification() {
    var cookie = $.cookie('userinfor');
    UserInfor = JSON.parse(cookie);
    if (UserInfor == null) return;
    var userId = UserInfor.UserId;
    noti_connection.invoke("GetNotification", userId).catch(function (err) {
        return console.error(err.toString());
    });
}

function MarkAllAsRead() {
    if (window.confirm("Sure to mark all notification as read status?")) {
        var cookie = $.cookie('userinfor');
        UserInfor = JSON.parse(cookie);
        if (UserInfor == null) return;
        noti_connection.invoke("ReadAll", UserInfor.UserId).catch(function (err) {
            return console.error(err.toString());
        });
    }
}


function openNotiHistory() {
    $("#NotificationHistoryModal_List").empty();
    var Notis = localStorage.getItem("Notifications");
    if (Notis != null) {
        Notis = JSON.parse(Notis);
        for (var i = 0; i < Notis.length; i++) {
            var html = String.format('<a href="#" onclick="HistoryItemClick({0}, \'{1}\', \'{2}\', \'{3}\', \'{4}\')" class="list-group-item list-group-item-action" style="font-size:14px;"><span style="color:grey;font-size:13px;">{4} {1}:</span>&nbsp;&nbsp;' + Notis[i].message.replace(/&qt;/g, "\'").replace(/&pt;/, "\"").replace(/&rt;/g, "\\").replace(/&rt;/g, "\/")+'</a>', Notis[i].id, Notis[i].sendsource, Notis[i].message, Notis[i].linkurl, Notis[i].timespan);
            $("#NotificationHistoryModal_List").append(html);
        }
    }
    $("#NotificationHistoryModal").modal("show");
}

function HistoryItemClick(id, sendsource, message, linkurl, timespan) {
    $("#NotificationHistoryModal").modal("hide");
    NotifiItemClick(id, sendsource, message, linkurl, timespan);
}