/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * 15/07/2015.
 */

// OnClose:
window.addEventListener("beforeunload", function (e) {
    chrome.runtime.sendMessage({go: true});
}, false);

function mk() {
    chrome.runtime.sendMessage({getPRdiv: true}, function (response) {
        // Add base for relative URLs:
        var bt = document.createElement("base");
        bt.setAttribute("href", response.host);
        document.getElementsByTagName("head")[0].appendChild(bt);

        // Add css:
        var cssHref = chrome.extension.getURL("/src/browser_action/browser_action.css");
        var cssLink = $("<link rel='stylesheet' type='text/css' href='" + cssHref + "'>");
        $("head").append(cssLink);

        // Fill in content:
        //$('body').prepend($(localStorage.div || '<div style="padding: 20px;">Loading...</div>'));
        $('#inbox-pull-request-reviewer').remove();
        $('#inbox-pull-request-author').remove();
        if (localStorage["_hide_my_pr"] != "true") {
            $('body').prepend($(response.myDiv));
        }
        $('body').prepend($(response.div));

        var remove = ['.spinner', '.secondary-link'];

        if (!response.show_repo_icon) remove.push('.aui-avatar-project');
        if (response.hideHead) remove.push("thead");
        if (!response.multiline) remove.push('.source', '.destination',
            '.pull-request-list-task-count-column-value', '.pull-request-list-task-count-column');

        remove.forEach(function (selector) {
            $(selector).each(function () {
                this.remove()
            })
        });

        $("a").attr("target", "_blank");
        $('td').css('padding-top', response.line_height).css('padding-bottom', response.line_height);
        $('th.author').html("By");

        if (response.multiline) {
            // Break rows:

            $('tr').each(function () {
                var newTR = $('<tr>');
                $.each(this.attributes, function () {
                    newTR.attr(this.name, this.value);
                });

                var oldTR = this;
                [6, 6, 6].forEach(function (i) {
                    newTR.insertAfter(oldTR).append($('th:eq(' + i + '), td:eq(' + i + ')', oldTR));
                })
            });
            //$('.title').attr('colspan',2);
            $('.source').attr('colspan', 2);
            $('.destination').attr('colspan', 2);
            $('.updated').attr('colspan', 2);
        }

        if (localStorage["_hide_bottom_bar"] == "true") {
            $('.bottom_bar').remove();
        }
    });
}

mk();
chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.loaded) mk();
    });