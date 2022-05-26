const moment = require("moment");

module.exports = function getInterval(end, start) {
  var ms = moment(end,"YYYY/MM/DD HH:mm:ss").diff(moment(start,"YYYY/MM/DD HH:mm:ss"));
  var d = moment.duration(ms);
  var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
  return s;
}