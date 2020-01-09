import path from 'path';

import getAllApps, { loadSecrets } from './util';
import { CantaraApplication } from '../util/types';

import { readFileSync } from 'fs';
import getAllPackageAliases from './aliases';
import { readFileAsJSON } from '../util/fs';

interface CantaraInitialConfig {
  /** Where the cantara package itself lives */
  packageRootDir: string;
  /** Path of Cantara project */
  projectDir?: string;
  currentCommand: {
    name: string;
    appname: string;
  };
}

type Dependencies = { [key: string]: string };

interface CantaraGlobalConfig {
  allApps: CantaraApplication[];
  allPackages: {
    aliases: { [key: string]: string };
    /** Include all those paths into webpack configs */
    include: string[];
  };
  dependencies: {
    /** Current React and React DOM version */
    react: Dependencies;
    /** Dependencies needed for TS */
    typescript: Dependencies;
  };
  /** Paths used internally by Cantara */
  internalPaths: {
    static: string;
    /** Where the cantara package itself lives */
    root: string;
  };
  /** Current runtime configuration (e.g. the command the user executed, the location of it etc.) */
  runtime: {
    /** Working directory where user executed Cantara */
    projectDir: string;
    /** Information about current command */
    currentCommand: {
      name: string;
      app: CantaraApplication;
    };
    /** Secrets from user's .secrets.json file */
    secrets: {
      AWS_ACCESS_KEY_ID?: string;
      AWS_SECRET_ACCESS_KEY?: string;
    };
  };
}

let globalConfig: CantaraGlobalConfig | undefined = undefined;

export default function getGlobalConfig() {
  if (!globalConfig)
    throw new Error("Cantara's global configuration was not set yet!");
  return globalConfig;
}

/** Config can only be set once */
export function configureCantara(config: CantaraInitialConfig) {
  const staticFilesPath = path.join(config.packageRootDir, 'static');
  const reactDependecies = readFileAsJSON(
    path.join(staticFilesPath, 'react-dependencies.json'),
  );
  const typescriptDependencies = readFileAsJSON(
    path.join(staticFilesPath, 'ts-dependencies.json'),
  );
  const projectDir = config.projectDir || process.cwd();
  const allApps = getAllApps(projectDir);
  const currentActiveApp = allApps.find(
    app => app.name === config.currentCommand.appname,
  );
  if (!currentActiveApp) {
    throw new Error(
      `The app "${config.currentCommand.appname}" does not exist.`,
    );
  }
  const configToUse: CantaraGlobalConfig = {
    allApps,
    allPackages: {
      aliases: getAllPackageAliases(allApps),
      include: allApps
        .filter(
          app => app.type === 'js-package' || app.type === 'react-component',
        )
        .map(app => app.paths.src),
    },
    dependencies: {
      react: reactDependecies,
      typescript: typescriptDependencies,
    },
    internalPaths: {
      root: config.packageRootDir,
      static: staticFilesPath,
    },
    runtime: {
      projectDir,
      currentCommand: {
        name: config.currentCommand.name,
        app: currentActiveApp,
      },
      secrets: loadSecrets(projectDir),
    },
  };
  globalConfig = Object.freeze(configToUse);
}