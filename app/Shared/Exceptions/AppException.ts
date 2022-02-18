import { Exception } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new AppException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class AppException extends Exception {
  public showable: boolean;
  constructor(message: string, status = 400, showable: boolean = true) {
    super(message, status, 'APP_EXCEPTION');

    this.message = message;
    this.status = status;
    this.showable = showable;
  }

  public async handle(error: this, ctx: HttpContextContract) {
    ctx.response
      .status(error.status)
      .json({ message: error.message, status: error.status, showable: this.showable });
  }
}
