
var phantom = require("phantomjs")
,   execFile = require("child_process").execFile
,   jn = require("path").join
,   u = require("url")
,   r2hPath = jn(__dirname, "../node_modules/respec/tools/respec2html.js")
;

exports.generate = function (url, params, cb) {
    url = u.parse(url, true);
    for (var k in params) if (params.hasOwnProperty(k)) url.query[k] = params[k];
    url = u.format(url);
    console.log("Generating", url);
    // Phantom's own timeouts are never reaching us for some reason, so we do our own
    var timedout = false;
    setTimeout(
        function () {
            timedout = true;
            cb({ status: 500, message: "Processing timed out." });
        }
    ,   10000
    );
    execFile(
        phantom.path
    ,   ["--ssl-protocol=any", r2hPath, url]
    ,   function (err, stdout, stderr) {
            if (timedout) return;
            // note: Phantom prints error on stdout even when you use console.error()
            if (err) return cb({ status: 500, message: err + "\n" + (stderr || stdout || "") });
            cb(null, stdout);
        }
    );
};
