"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deriveStageNameFromCmd(cmdName) {
    if (cmdName === 'build' || cmdName === 'deploy') {
        return 'production';
    }
    if (cmdName === 'test') {
        return 'test';
    }
    return 'development';
}
exports.default = deriveStageNameFromCmd;