import 'reflect-metadata';
import getPort from 'get-port';
import { configure } from 'japa';
import sourceMapSupport from 'source-map-support';

process.env.NODE_ENV = 'testing';
process.env.ADONIS_ACE_CWD = __dirname;
sourceMapSupport.install({ handleUncaughtExceptions: false });

async function startHttpServer() {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor');
  process.env.PORT = String(await getPort());
  await new Ignitor(__dirname).httpServer().start();
}

/**
 * Configure test runner
 */
configure({
  files: ['app/Modules/**/UseCases/**/*.spec.ts'],
  before: [startHttpServer],
});
