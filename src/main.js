/**
 * Created by liguanjian on 2017/7/29.
 */

let provider = require("./data_provider.js");
var _ = require("underscore");
var path = require("path");

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
        setDataInSelect(curDialogsData);
    }
};
var setDataInSelect = (data)=> {
    $("#selectM").empty();
    _.map(data, (it, indx)=> {
        $("#selectM").append('<option id="' + it.id + '" name="' + it.name + '">' + it.id + '-' + it.name + '</option>');
    });
};
loadSelect();

//更新数据至右边属性栏。
var updateAttrs = (id)=> {
    var attrMap = {
        "role_name": "角色名字",
        "model_id": "模型ID", "action_id": "动作ID",
        "location": "角色位置", "content": "对话内容",
        "audio_id": "音频ID"
    };
    var box = $("#tx_show");
    box.empty();
    var d = _.findWhere(curDialogsData, {id: parseInt(id)});
    if (d) {
        d = d.list;//_.omit(d, ["id", "name"]);
        _.map(d, function(it,idx){
            var tx = "";
            _.map(it, (v, k)=> {
                tx += (" \<" + attrMap[k] + "/" + v + "\> ");
            });
            box.append('<a class="dia_item" idx="'+idx+'">'+ (idx+1) + ". " + tx+ '</a>');
        });
    }
};

//已选择的id和name
var selectId;
var selectName;
$('#selectM').change(function () {
    var opitionSelect = $(this).children('option:selected');
    selectId = opitionSelect.attr("id");
    selectName = opitionSelect.attr("name");
    $(".dia_id").val(selectId);
    $(".dia_name").val(selectName);
    updateAttrs(selectId);
});
//添加一个对话


//文件选择后的反应
$('#selectLocFile').on("change", function () {
    var selectTx = $(this).val();
    console.log(selectTx);
    if (selectTx && selectTx != "") {
        if (localStorage.getItem("d_path") != selectTx) {
            localStorage.setItem("d_path", path.resolve(selectTx));
            loadSelect();
        }
    }
});

//输入搜索框内内容
$("#searchgroup").on('input', function () {
    var v = $(this).val();
    //如果为纯数字，是通过id来搜索
    var d;
    d = _.filter(curDialogsData, (it, idx)=> {
        return it.id.toString().indexOf(v) != -1 || it.name.toString().indexOf(v) != -1;
    });
    setDataInSelect(d);
});

//点击选定某一个对话,后续是编辑
var curSelectIndex;
$("#tx_show").on("click", ".dia_item", function(e){
    $(".dia_item").removeClass("on_dia_item");
    $(this).addClass("on_dia_item");
    curSelectIndex = parseInt($(this).attr("idx"));
});

//新加一个对话
$("#btnNewDia").on("click", function(){
    var nextIndex;
    if(curDialogsData && curDialogsData.length > 0){
        nextIndex = _.max(_.pluck(curDialogsData, 'id'));
        nextIndex ++;
    }else{
        nextIndex = 50000;
        curDialogsData = [];
    }
    curDialogsData.push({id:nextIndex, name:"默认名称"});
    setDataInSelect(curDialogsData);
});

//删除一个对话
$("#btnDelDia").on("click", function(){
    if(selectId){
        curDialogsData = _.filter(curDialogsData, (it, idx)=> {
            return it.id.toString() != selectId;
        });
        selectId = null;
        setDataInSelect(curDialogsData);
        updateAttrs(selectId);
    }else{
        showErrorTips("温馨提示->未选中要删除的项", "is-info");
    }
});