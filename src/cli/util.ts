import path from 'path';
import dotenv from 'dotenv';

/** "Normalizes" the behaviour of the CLI
 * no matter if Cantara is executed by the user
 * in a project folder or by nodemon in
 * development mode
 */
export function setupCliContext() {
  // Set CWD to path of Cantara
  process.chdir(path.join(__dirname, '..', '..'));
}

/**
 * Loads .env file for development
 * (only during development)
 */
export function loadEnv() {
  if (process.env.NODE_ENV === 'development') {
    dotenv.config();
  }
}

/**
 * Catch uncaught errors
 */
export function setupErrorHandling() {
  process.on('uncaughtException', err => {
    console.log(err);
    process.exit(1);
  });

  process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
  });
}

/**
 * Returns the path of the
 * user's project.
 * Only call this function after
 * dotenv has been executed!
 */
export function getProjectPath(): string {
  const userProjectPath =
    process.env.NODE_ENV === 'development'
      ? (process.env.DEV_PROJECT_PATH as string)
      : process.cwd();
  return userProjectPath;
}
