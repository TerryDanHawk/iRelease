//Dr.PI AI控制类


//let  ai=new AI({eventdelete:function(){}});


function AI(options) {
   

    $("#btnAI_Icon").click(function () {
        if (options.eventdelegate) {
            options.eventdelegate();
        }

    });

   
   
}


//公共属性和方法

AI.prototype = {

    NowWords: null,
    IsActive: function () {
        if (localStorage.getItem("aimoveflag") == "true") {
            return true;
        }
        else {
            return false;
        }

    },

    Speak: function (text) {
        if (localStorage.getItem("aimoveflag") != "true") {
            return;
        }
        if ($("#btnAI_Icon") == null) {
            return;
        }
        AI.prototype.NowWords = text;
        $("#btnAI_Icon").popover('dispose');
        clearInterval(speakinterval);

        $("#btnAI_Icon").popover({
            animation: true,
            container: "body",
            content: text,
            html: true,
            //delay: { "show": 1000, "hide": 3000 },
            placement: aispeakplacement,//"bottom",
            trigger: "manual"
        });


        $("#btnAI_Icon").popover('show');
        var second = parseInt(text.length / 2) * 2;
        var count = 0;

        var speakinterval = setInterval(function () {

            count++;

            if (count >= second) {

                $("#btnAI_Icon").popover('dispose');

                clearInterval(speakinterval);
            }

        }, 500);

    }

}








