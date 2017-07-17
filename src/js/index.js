/**
 * Created by liguanjian on 2017-3-3.
 */

$(function () {
    $("#p1").show();
    $(".menu a").on("click", function () {
        $(".menu a").removeClass('is-active');
        $(this).addClass('is-active');
        $(".part").hide();
        $("#" + $(this).attr("tarId")).show();
    });

    // $(".delete").on("click", function () {
    //     $(this).closest(".message").hide();
    // })


    $(".subP1").on("click", function () {
        var inputTx = $.trim($(".txtP1").val());
        var list = inputTx.split('\n');
        if (!list || list.length < 1 || list[0] == "") {
            alert('列表为空不能提交，请正确填写。');
            return;
        }
        var pass = true;
        for (var i in list) {
            if (list[i].match(/^\$.*\.[A-Za-z0-9]+$/)) {
                console.log(list[i]+"√")
            } else {
                pass = false;
                alert("提交文件"+list[i]+"格式不正确。")
            }
        }

        if (pass) {
            //提交给后端
            console.log('pass')
            $.post("/task/1", {tx:inputTx}, function (data) {
                console.log(data);
                if(data.code == 0){
                    $(".mP1").addClass("is-active");
                }
            })
        }
    })

    $(".modal-close, .modal .delete").on("click", function () {
        $(".modal").removeClass("is-active");
    })
});