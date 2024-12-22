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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MakerPage;
const react_1 = __importStar(require("react"));
function MakerPage() {
    const [textData, setTextData] = (0, react_1.useState)();
    const [soundTexts, setSoundTexts] = (0, react_1.useState)([]);
    const onClick = () => __awaiter(this, void 0, void 0, function* () {
        const filePathElement = document.getElementById('selectedFile');
        const filePath = yield window.electron.openFileDialog();
        const text = yield window.electron.readFileContent(filePath);
        setTextData(text);
    });
    (0, react_1.useEffect)(() => {
        if (!textData)
            return;
        const sounds = textData.split('\n').filter((textLine) => {
            return textLine.indexOf('PlayAlertSound') == 0 || textLine.indexOf('CustomAlertSound') == 0;
        });
        setSoundTexts(sounds);
        const playAlertSoundArr = [];
        const customAlertSoundArr = [];
        const lines = textData.split('\n');
        lines.forEach((line) => {
            const words = line.trim().split(' ');
            if (words.length < 2)
                return;
            const command = words[0];
            const secondValue = words[1];
            if (command === 'PlayAlertSound') {
                playAlertSoundArr.push(secondValue);
            }
            else if (command === 'CustomAlertSound') {
                customAlertSoundArr.push(secondValue);
            }
        });
        const uniquePlayAlertSound = [...new Set(playAlertSoundArr)];
        const uniqueCustomAlertSound = [...new Set(customAlertSoundArr)];
        console.log('PlayAlertSound 중복 제거된 값들:', uniquePlayAlertSound);
        console.log('CustomAlertSound 중복 제거된 값들:', uniqueCustomAlertSound);
        return;
    }, [textData]);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: "title-text" }, "\uD544\uD130 \uD30C\uC77C\uC740 \uC6D0\uB798 \uC0AC\uC6A9\uD558\uB358 \uC704\uCE58(Poe2 \uD544\uD130\uD3F4\uB354)\uC5D0 \uB193\uACE0 \uC5F4\uC5B4\uC8FC\uC138\uC694(\uADF8\uB798\uC57C \uC0AC\uC6B4\uB4DC \uBBF8\uB9AC\uB4E3\uAE30 \uAC00\uB2A5)"),
        react_1.default.createElement("button", { onClick: () => onClick() }, "\uD544\uD130 \uD30C\uC77C \uC5F4\uAE30"),
        !soundTexts[0] && react_1.default.createElement("div", null, "\uC0AC\uC6B4\uB4DC \uC124\uC815\uC774 \uD3EC\uD568\uB418\uC9C0 \uC54A\uC740 \uD544\uD130\uC785\uB2C8\uB2E4."),
        !!soundTexts[0] && react_1.default.createElement("div", null,
            soundTexts.length.toLocaleString(),
            "\uAC1C")));
}
