/**
 * Created by liguanjian on 2017-3-3.
 */
var showErrorTips = function(tx){
    $(".mP1 .message-body").text(tx);
    $(".mP1").addClass("is-active");
};

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


    $(".modal-close, .modal .delete").on("click", function () {
        $(".modal").removeClass("is-active");
    })
});

