"use client";
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatePicker = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const date_fns_1 = require("date-fns");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@elearning/lib/utils");
const button_1 = require("../../../../../packages/ui/src/ui/button");
const calendar_1 = require("../../../../../packages/ui/src/ui/calendar");
const popover_1 = require("../../../../../packages/ui/src/ui/popover");
const DatePicker = React.forwardRef(({ value, onChange, placeholder = "Select date", disabled = false, className, fromDate, toDate, }, ref) => {
    return ((0, jsx_runtime_1.jsxs)(popover_1.Popover, { children: [(0, jsx_runtime_1.jsx)(popover_1.PopoverTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", disabled: disabled, className: (0, utils_1.cn)("w-full justify-start text-left font-normal", !value && "text-muted-foreground", className), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "mr-2 h-4 w-4" }), value ? (0, date_fns_1.format)(value, "PPP") : (0, jsx_runtime_1.jsx)("span", { children: placeholder })] }) }), (0, jsx_runtime_1.jsx)(popover_1.PopoverContent, { className: "w-auto p-0", align: "start", children: (0, jsx_runtime_1.jsx)(calendar_1.Calendar, { mode: "single", selected: value, onSelect: onChange, initialFocus: true, fromDate: fromDate, toDate: toDate }) })] }));
});
exports.DatePicker = DatePicker;
DatePicker.displayName = "DatePicker";
