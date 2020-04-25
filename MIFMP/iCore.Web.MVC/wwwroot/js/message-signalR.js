
var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

var UserList = null;

connection.on("ReceiveMessage", function (senduserId, recieveuserId, sendUserName, time, message,userlist) {

    var cookie = $.cookie('userinfor');
    UserInfor = JSON.parse(cookie);
    if (UserInfor == null) return;
    if (senduserId == UserInfor.UserId.toString()) return;
    if (recieveuserId != UserInfor.UserId.toString()) return;
    RefreshUserList(userlist);

    //记录聊天历史
    var ChatHistory = JSON.parse(localStorage.getItem("ChatHistory"));
    if (ChatHistory == null) ChatHistory = [];
    ChatHistory.push(
        {
            "senduserId": senduserId,
            "recieveuserId": recieveuserId,
            "sendUserName": sendUserName,
            "time": time,
            "message": message
        });
    localStorage.setItem("ChatHistory", JSON.stringify(ChatHistory));
    //
    if (senduserId != $("#chatitem_userid").val().toString()) {        
        var UnReadMessages = JSON.parse(localStorage.getItem("UnReadMessages"));
        if (UnReadMessages == null) UnReadMessages = [];
        UnReadMessages.push(
            {
                "senduserId": senduserId,
                "recieveuserId": recieveuserId,
                "sendUserName": sendUserName,
                "time": time,
                "message": message
            });
        localStorage.setItem("UnReadMessages", JSON.stringify(UnReadMessages));
        CountUnReadMessage();

        return;
    }
    //var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "\'");
    var msg = message.replace(/'/g, "\'");
    var innerHtml = '';
    innerHtml = String.format(
        '<div class="direct-chat-msg">' +
        '<div class= "direct-chat-info clearfix" >' +
        '<span class="direct-chat-name float-left">{0}</span>' +
        '<span class="direct-chat-timestamp float-right">{2}</span>' +
        '</div >' +
        '<img class="direct-chat-img" src="/images/user2-160x160.jpg" >' +
        '<div class="direct-chat-text">{1}</div>' +
        '</div>'
        , sendUserName, msg, time)

    $("#chatbody").append(innerHtml);
    $("#chatbody").scrollTop($("#chatbody")[0].scrollHeight);
});

    connection.on("Connected", function (connectionId) {

    var cookie = $.cookie('userinfor');
    UserInfor = JSON.parse(cookie);
    if (UserInfor == null) return;

    connection.invoke("RegistUser", connectionId, UserInfor.UserId).catch(function (err) {
            return console.error(err.toString());
        });

});


function RefreshUserList(userList) {    
    UserList = userList;    
    $("#msgUserList").empty();
    for (var i = 0; i < userList.length; i++) {

        if (userList[i].userId != UserInfor.UserId) {
            var htmlitem = "";
            htmlitem = String.format(
                '<a  id="useritem_{0}" name="useritem_{1}" onclick="UserItemClick(this.id,this.name)" href="#" class="dropdown-item">' +
                '<div class= "media">' +
                '<img src="{3}" alt="User Avatar" class="img-size-50 mr-3 img-circle">' +
                '<div class="media-body">' +
                '<h3 class="dropdown-item-title">' +
                '{1}' +
                '<span class="float-right text-sm {2}"><i class="fa fa-circle"></i></span>' +
                '</h3>' +
                '<br/><p id="pitem_{0}" class="text-sm text-muted" style="display:none;"><i class="fa fa-clock-o mr-1"></i><span id="spanitem_{0}"></span></p>' +
                '</div>' +
                '</div>' +
                '</a>' +
                '<div class="dropdown-divider"></div>'
                ,
                userList[i].userId, userList[i].realName, userList[i].status == "on" ? "text-success" : "text-warning", userList[i].headPhotoURL == null ? "\\images\\user1-128x128.jpg" : userList[i].headPhotoURL);
            $("#msgUserList").append(htmlitem);
        }
    }
}

connection.on("Registed", function (userList) {

    var cookie = $.cookie('userinfor');
    UserInfor = JSON.parse(cookie);
    if (UserInfor == null) return;
    RefreshUserList(userList);
    CountUnReadMessage();
});

    connection.start().catch(function (err) {
        return console.error(err.toString());
});

    $("#sendChatbutton").click(function (event) {

        SendMessage();
      
        event.preventDefault();
});

$("#chatMessage").keydown(function (event) {
    if (event.ctrlKey && event.keyCode == 13) {
        SendMessage();       
    }
})  

function SendMessage() {
    
    var cookie = $.cookie('userinfor');
    UserInfor = JSON.parse(cookie);
    if (UserInfor == null) return;
    var user = UserInfor.RealName;
    var message = $("#chatMessage").val();
    message = message.split("\n").join("<br />");
    var d = new Date();
    var time = d.format("yyyy-MM-dd HH:mm:ss");

    var innerHtml = '';
    innerHtml = String.format(
        '<div class="direct-chat-msg right">' +
        '<div class= "direct-chat-info clearfix" >' +
        '<span class="direct-chat-name float-right">{0}</span>' +
        '<span class="direct-chat-timestamp float-left">{2}</span>' +
        '</div >' +
        '<img class="direct-chat-img" src="/images/user2-160x160.jpg" >' +
        '<div class="direct-chat-text">{1}</div>' +
        '</div>'
        , user, message, time)

    $("#chatbody").append(innerHtml);

    $("#chatbody").scrollTop($("#chatbody")[0].scrollHeight);

    var senduserId = UserInfor.UserId;
    var recieveuserId = $("#chatitem_userid").val();
    var sendUserName = UserInfor.RealName;

    connection.invoke("SendMessage", senduserId,recieveuserId,sendUserName, time, message).catch(function (err) {
        return console.error(err.toString());
    });

    //记录聊天历史
    var ChatHistory = JSON.parse(localStorage.getItem("ChatHistory"));
    if (ChatHistory == null) ChatHistory = [];
    ChatHistory.push(
        {
            "senduserId": senduserId,
            "recieveuserId": recieveuserId,
            "sendUserName": sendUserName,
            "time": time,
            "message": message
        });
    localStorage.setItem("ChatHistory", JSON.stringify(ChatHistory));
    //

    $("#chatMessage").val("");
}

function UserItemClick(userid, username) {
    userid = userid.replace("useritem_", "");
    username = username.replace("useritem_", "");

    $("#chatitem_username").html(username);
    $("#chatitem_userid").val(userid);
    $("#chatMessage").val("");
    $("#chatdialog_modal").modal("show");
    $("#chatbody").empty();

    var cookie = $.cookie('userinfor');
    UserInfor = JSON.parse(cookie);
    if (UserInfor == null) return;

    //读取未接收到的消息
    var UnReadMessages = JSON.parse(localStorage.getItem("UnReadMessages"));
    var MyUrMessagesIndex = [];
    if (UnReadMessages == null) UnReadMessages = [];
    for (var i = 0; i < UnReadMessages.length; i++) {
        if (UnReadMessages[i].senduserId == userid) {

            MyUrMessagesIndex.push(i);
            //进行加载操作
            var msg = UnReadMessages[i].message.replace(/'/g, "\'");
            var innerHtml = '';
            innerHtml = String.format(
                '<div class="direct-chat-msg">' +
                '<div class= "direct-chat-info clearfix" >' +
                '<span class="direct-chat-name float-left">{0}</span>' +
                '<span class="direct-chat-timestamp float-right">{2}</span>' +
                '</div >' +
                '<img class="direct-chat-img" src="/images/user2-160x160.jpg" >' +
                '<div class="direct-chat-text">{1}</div>' +
                '</div>'
                , UnReadMessages[i].sendUserName, msg, UnReadMessages[i].time)

            $("#chatbody").append(innerHtml);
        }
    }
    //删除已经追加上的未读消息
    for (var i = 0; i < MyUrMessagesIndex.length; i++) {
        UnReadMessages.splice(MyUrMessagesIndex[i], 1);
    }
    //更新本地存储
    localStorage.setItem("UnReadMessages", JSON.stringify(UnReadMessages));
    

    
}



function ShowChatHistory() {
    var ChatHistory = JSON.parse(localStorage.getItem("ChatHistory"));
    if (ChatHistory == null) return;
    var cookie = $.cookie('userinfor');
    UserInfor = JSON.parse(cookie);
    if (UserInfor == null) return;
    $("#chatbody").empty();
    var chartid = $("#chatitem_userid").val();
    if (chartid == null) return;
    for (var i = 0; i < ChatHistory.length; i++) {
        //接收
        if (ChatHistory[i].recieveuserId.toString() == UserInfor.UserId.toString() && ChatHistory[i].senduserId.toString() == chartid.toString()) {

            var msg = ChatHistory[i].message.replace(/'/g, "\'");
            var innerHtml = '';
            innerHtml = String.format(
                '<div class="direct-chat-msg">' +
                '<div class= "direct-chat-info clearfix" >' +
                '<span class="direct-chat-name float-left">{0}</span>' +
                '<span class="direct-chat-timestamp float-right">{2}</span>' +
                '</div >' +
                '<img class="direct-chat-img" src="/images/user2-160x160.jpg" >' +
                '<div class="direct-chat-text">{1}</div>' +
                '</div>'
                , ChatHistory[i].sendUserName, msg, ChatHistory[i].time)

            $("#chatbody").append(innerHtml);
        }

        //发送
        if (ChatHistory[i].senduserId.toString() == UserInfor.UserId.toString() && ChatHistory[i].recieveuserId.toString() == chartid.toString()) {

            var msg = ChatHistory[i].message.replace(/'/g, "\'");
            var innerHtml = '';
            innerHtml = String.format(
                '<div class="direct-chat-msg right">' +
                '<div class= "direct-chat-info clearfix" >' +
                '<span class="direct-chat-name float-right">{0}</span>' +
                '<span class="direct-chat-timestamp float-left">{2}</span>' +
                '</div >' +
                '<img class="direct-chat-img" src="/images/user2-160x160.jpg" >' +
                '<div class="direct-chat-text">{1}</div>' +
                '</div>'
                , ChatHistory[i].sendUserName, msg, ChatHistory[i].time)

            $("#chatbody").append(innerHtml);

            
        }
    }

    $("#chatbody").scrollTop($("#chatbody")[0].scrollHeight);
}

function ClearChatDialog() {

    $('#chatitem_userid').val("-1");
    CountUnReadMessage();
    
}


function CountUnReadMessage() {

    //统计总未读消息数
    var UnReadMessages = JSON.parse(localStorage.getItem("UnReadMessages"));
    if (UnReadMessages == null || UnReadMessages.length == 0) {
        $("#msgCount").hide();

    }
    else {
        $("#msgCount").show();
        $("#msgCount").html(UnReadMessages.length);
    }

    //按用户分批次统计
    if (UserList != null) {        
        for (var i = 0; i < UserList.length; i++) {
            var count = 0;
            if (UnReadMessages != null) {

                for (var j = 0; j < UnReadMessages.length; j++) {
                    if (UnReadMessages[j].senduserId.toString() == UserList[i].userId.toString()) {
                        count++;
                    }
                }
                if (count == 0) {

                    $("#pitem_" + UserList[i].userId.toString()).hide();
                }
                else {

                    $("#pitem_" + UserList[i].userId.toString()).show();
                    $("#spanitem_" + UserList[i].userId.toString()).html(count + " messages unread");
                }
            }
        }
    }
}