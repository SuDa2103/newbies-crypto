"use strict";
exports.__esModule = true;
exports.Field = void 0;
var tslib_1 = require("tslib");
var formik_1 = require("formik");
var React = tslib_1.__importStar(require("react"));
var Field = function (_a) {
    var fast = _a.fast, children = _a.children, restProps = tslib_1.__rest(_a, ["fast", "children"]);
    if (fast) {
        return React.createElement(formik_1.FastField, tslib_1.__assign({}, restProps), children);
    }
    return React.createElement(formik_1.Field, tslib_1.__assign({}, restProps), children);
};
exports.Field = Field;
exports["default"] = exports.Field;
//# sourceMappingURL=index.js.map