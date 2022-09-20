"use strict";
exports.__esModule = true;
exports.HtmlText = void 0;
var tslib_1 = require("tslib");
var formik_1 = require("formik");
var React = tslib_1.__importStar(require("react"));
var HtmlText = function (props) { return (React.createElement(formik_1.Field, tslib_1.__assign({}, props), function (_a) {
    var field = _a.field;
    return field.value;
})); };
exports.HtmlText = HtmlText;
exports["default"] = exports.HtmlText;
//# sourceMappingURL=index.js.map