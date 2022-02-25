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
| new UnauthorizedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class UnauthorizedException extends Exception {
  public showable: boolean;

  constructor(message: string, showable: boolean = true) {
    super(message, 401, 'UNAUTHORIZED_EXCEPTION');
    this.showable = showable;
    this.message = message;
  }

  public async handle(error: this, ctx: HttpContextContract) {
    ctx.response
      .status(error.status)
      .json({ message: error.message, status: error.status, showable: this.showable });
  }
}
