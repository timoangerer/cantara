import path from 'path';

import {
  CantaraCommand,
  parseCliCommand,
  execCantaraCommand,
} from './cli-tools';
import executeArbitraryCmdWithinApp from '../scripts/arbitrary';
import startDevelopmentServer from '../scripts/dev';
import deployActiveApp from '../scripts/deploy';
import buildActiveApp from '../scripts/build';
import executeTests from '../scripts/test';
import createNewAppOrPackage from '../scripts/new';
import initializeNewProject from '../scripts/init';
import startEndToEndTests from '../scripts/e2e';
import onPrePush from '../scripts/on-pre-push';
import execCmdIfAppsChanged from '../scripts/exec-changed';
import { loadEnv, setupCliContext, setupErrorHandling } from './util';

process.on('uncaughtException', err => {
  console.log(err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

const allCantaraCommands: CantaraCommand[] = [
  {
    actionName: 'dev',
    parameters: [{ name: 'appname', required: true }],
    exec: () => {
      return startDevelopmentServer();
    },
  },
  {
    actionName: 'deploy',
    parameters: [{ name: 'appname', required: true }],
    exec: () => {
      return deployActiveApp();
    },
  },
  {
    actionName: 'build',
    parameters: [{ name: 'appname', required: true }],
    exec: () => {
      return buildActiveApp();
    },
  },
  {
    actionName: 'test',
    parameters: [{ name: 'appname', required: true }],
    exec: () => {
      return executeTests();
    },
  },
  {
    actionName: 'run',
    parameters: [{ name: 'appname', required: true }],
    exec: ({ originalCommand }) => {
      return executeArbitraryCmdWithinApp(originalCommand);
    },
  },
  {
    actionName: 'new',
    parameters: [
      { name: 'type', required: true },
      { name: 'name', required: true },
    ],
    exec: ({ parameters: { name, type } }) => {
      return createNewAppOrPackage({ type: type as any, name });
    },
  },
  {
    actionName: 'init',
    noSetup: true,
    parameters: [{ name: 'path' }, { name: 'template' }],
    exec: ({ parameters: { path: userPath, template } }) => {
      const templateToUse = template ? template : 'cantara-simple-starter';
      return initializeNewProject({
        newFolderPath: userPath,
        templateName: templateToUse,
      });
    },
  },
  {
    actionName: 'e2e',
    exec: () => {
      return startEndToEndTests();
    },
  },
  {
    actionName: 'exec-changed',
    parameters: [{ name: 'appnames', required: true }],
    exec: ({ parameters: { appnames: appnamesParam }, originalCommand }) => {
      const [, , ...userCmd] = originalCommand;
      const appnames = appnamesParam.split(',');
      return execCmdIfAppsChanged({ appnames, userCmd: userCmd.join(' ') });
    },
  },
  {
    actionName: 'on-pre-push',
    parameters: [],
    exec: () => {
      onPrePush();
    },
  },
];

export default function setupCliInterface() {
  setupErrorHandling();
  loadEnv();
  setupCliContext();

  const TEST_CMD = (process.env.DEV_CANTARA_COMMAND || '').split(' ');
  const cmdToUse =
    process.env.NODE_ENV === 'development' ? TEST_CMD : process.argv.slice(2);
  const parsedCommand = parseCliCommand(cmdToUse);
  return execCantaraCommand({
    allCantaraCommands,
    parsedCommand,
    originalCommand: cmdToUse,
  });
}