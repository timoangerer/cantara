"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var ncp_1 = __importDefault(require("ncp"));
var fs_1 = require("fs");
var util_1 = require("util");
var cantara_config_1 = __importDefault(require("../cantara-config"));
var react_1 = __importDefault(require("./react"));
var util_2 = require("./util");
var serverless_1 = __importDefault(require("./serverless"));
var packages_1 = __importDefault(require("./packages"));
var fs_2 = require("../util/fs");
var ncp = util_1.promisify(ncp_1.default);
/** Make paths relative for typescript */
function aliasesAbsoluteToRelative(aliases) {
    return Object.keys(aliases).reduce(function (newObj, currAliasName) {
        var _a;
        var currPath = aliases[currAliasName];
        var newPath = currPath.slice(currPath.lastIndexOf('packages'));
        return __assign(__assign({}, newObj), (_a = {}, _a[currAliasName] = [newPath], _a));
    }, {});
}
/** Prepares user's project */
function prepareCantaraProject() {
    return __awaiter(this, void 0, void 0, function () {
        var globalCantaraConfig, rootDir, STATIC_PATHS_TO_COPY, _i, STATIC_PATHS_TO_COPY_1, pathToCopy, fullPath, tsConfig, aliases, newTsConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    globalCantaraConfig = cantara_config_1.default();
                    rootDir = globalCantaraConfig.runtime.projectDir;
                    STATIC_PATHS_TO_COPY = ['.vscode', '.gitignore', '.prettierrc'];
                    _i = 0, STATIC_PATHS_TO_COPY_1 = STATIC_PATHS_TO_COPY;
                    _a.label = 1;
                case 1:
                    if (!(_i < STATIC_PATHS_TO_COPY_1.length)) return [3 /*break*/, 4];
                    pathToCopy = STATIC_PATHS_TO_COPY_1[_i];
                    fullPath = path_1.default.join(rootDir, pathToCopy);
                    if (!!fs_1.existsSync(fullPath)) return [3 /*break*/, 3];
                    return [4 /*yield*/, ncp(path_1.default.join(globalCantaraConfig.internalPaths.static, pathToCopy), fullPath)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    tsConfig = JSON.parse(fs_1.readFileSync(path_1.default.join(globalCantaraConfig.internalPaths.static, 'tsconfig.json')).toString());
                    aliases = globalCantaraConfig.allPackages.aliases;
                    newTsConfig = __assign(__assign({}, tsConfig), { compilerOptions: __assign(__assign({}, tsConfig.compilerOptions), { paths: aliasesAbsoluteToRelative(aliases) }) });
                    fs_2.writeJson(path_1.default.join(rootDir, 'tsconfig.json'), newTsConfig);
                    // Install React dependencies globally for project
                    return [4 /*yield*/, util_2.createOrUpdatePackageJSON({
                            rootDir: rootDir,
                            expectedDependencies: globalCantaraConfig.dependencies.react,
                        })];
                case 5:
                    // Install React dependencies globally for project
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Prepares the application folders if not done already.
 */
function onPreBootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var globalCantaraConfig, _i, _a, app;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    globalCantaraConfig = cantara_config_1.default();
                    return [4 /*yield*/, prepareCantaraProject()];
                case 1:
                    _b.sent();
                    _i = 0, _a = globalCantaraConfig.allApps;
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 9];
                    app = _a[_i];
                    if (!(app.type === 'react')) return [3 /*break*/, 4];
                    return [4 /*yield*/, react_1.default(app)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    if (!(app.type === 'serverless')) return [3 /*break*/, 6];
                    return [4 /*yield*/, serverless_1.default(app)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    if (!(app.type === 'react-component' || app.type === 'js-package')) return [3 /*break*/, 8];
                    return [4 /*yield*/, packages_1.default(app)];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 2];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.default = onPreBootstrap;