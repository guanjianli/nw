/**
 * Created by liguanjian on 2017/7/30.
 */

let provider = require("./data_provider.js");
var _ = require("underscore");
var path = require("path");

var showErrorTips = function(tx, type){
    $(".mP1 .message-body").text(tx);
    $(".mP1").addClass("is-active");
    if(type){
        $(".message").removeClass("is-danger").addClass(type)
    }
};

//点击选定某一个属性,后续是编辑
var curSelectIndex;
function cliekHandle(elm, cls){
    $(".sel_box").on("click", elm, function(e){
        $(elm).removeClass(cls);
        $(this).addClass(cls);
    });
}
cliekHandle(".act_item", "on_act_item");
cliekHandle(".evt_item", "on_act_item");


var curDialogsData;
//初始化选择框
var loadSelect = ()=> {
    //读到对话的数据
    var url = localStorage.getItem("d_path");
    var r = provider.readData(url);
    if (typeof(r) == "string") {
        showErrorTips(r);
    } else {
        var dialogsData = url ? r : {};
        curDialogsData = dialogsData.dialogs || [];
    }
};
loadSelect();


//更新数据至右边属性栏。
var updateAttrs = (id)=> {
    var attrMap = {
        "role_name": "角色名字",
        "model_id": "角色模型", "action_id": "调用动作",
        "location": "对话属性", "content": "对话文本",
        "audio_id": "音频"
    };
    var box = $("#act_box");
    box.empty();
    var d = _.findWhere(curDialogsData, {id: parseInt(id)});
    if (d) {
        d = d.list;//_.omit(d, ["id", "name"]);
        _.map(d, function(it,idx){
            var tx = "";
            _.map(it, (v, k)=> {
                tx = ("" + attrMap[k] + ":" + v + "");
                box.append('<span class="evt_item" idx="'+idx+'">'+ tx+ '</span>');
            });

        });
    }
};

var id = window.location.search.match(/[^=]\d+/);
if(id){
    updateAttrs(id[0]);
}


