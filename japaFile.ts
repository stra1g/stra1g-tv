import 'reflect-metadata';
import execa from 'execa';
import getPort from 'get-port';
import { configure } from 'japa';
import sourceMapSupport from 'source-map-support';

process.env.NODE_ENV = 'testing';
process.env.ADONIS_ACE_CWD = __dirname;
sourceMapSupport.install({ handleUncaughtExceptions: false });

async function runMigrations() {
  await execa.node('ace', ['migration:run'], {
    stdio: 'inherit',
  });
}

async function runSeeders() {
  await execa.node('ace', ['db:seed'], {
    stdio: 'inherit',
  });
}

async function rollbackMigrations() {
  await execa.node('ace', ['migration:rollback', '--batch=0'], {
    stdio: 'inherit',
  });
}

async function startHttpServer() {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor');
  process.env.PORT = String(await getPort());
  await new Ignitor(__dirname).httpServer().start();
}

function getTestFiles() {
  let userDefined = process.argv.slice(2)[0];
  if (!userDefined) {
    return ['app/Modules/**/UseCases/**/*.spec.ts', 'tests/*.spec.ts'];
  }

  return `${userDefined.replace(/\.ts$|\.js$/, '')}.ts`;
}

/**
 * Configure test runner
 */
configure({
  files: getTestFiles(),
  before: [runMigrations, runSeeders, startHttpServer],
  after: [rollbackMigrations],
});
