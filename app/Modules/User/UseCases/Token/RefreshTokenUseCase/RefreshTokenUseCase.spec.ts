import { AuthContract, OATGuardContract, OpaqueTokenContract } from '@ioc:Adonis/Addons/Auth';
import test from 'japa';
import { stubInterface } from 'ts-sinon';
import { DateTime } from 'luxon';
import crypto from 'crypto';

import { TokensRepositoryInMemory } from 'App/Modules/User/Repositories/InMemory/TokensRepositoryInMemory';
import { UsersRepositoryInMemory } from 'App/Modules/User/Repositories/InMemory/UsersRepositoryInMemory';
import { RefreshTokenUseCase } from './RefreshTokenUseCase';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import I18n, { I18nContract } from '@ioc:Adonis/Addons/I18n';

let tokensRepositoryInMemory: TokensRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let refreshTokenUseCase: RefreshTokenUseCase;
let authStubbed: AuthContract;
let i18n: I18nContract;

test.group('Unit: Refresh token', (group) => {
  group.beforeEach(async () => {
    tokensRepositoryInMemory = new TokensRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    i18n = I18n.locale('pt-br');

    function generateStubbed(): Promise<OpaqueTokenContract<'user'>> {
      return new Promise((resolve) => {
        const tokenValue = crypto.randomBytes(32).toString('hex');

        const token: OpaqueTokenContract<'user'> = {
          meta: {},
          name: 'token',
          type: 'bearer',
          user: 'user',
          token: tokenValue,
          tokenHash: '0#20330sjd',
          toJSON: () => {
            return {
              type: 'bearer',
              token: tokenValue,
              expires_at: DateTime.now().plus({ minutes: 5 }).toString(),
              expires_in: 5 * 60 * 1000,
            };
          },
        };
        resolve(token);
      });
    }

    const guardStubbed = stubInterface<OATGuardContract<'user', 'api'>>({
      generate: generateStubbed()
        .then((value) => value)
        .catch((err) => err),
    });

    authStubbed = stubInterface<AuthContract>({
      use: (() => guardStubbed)(),
    });
  });

  test('it should not be able to refresh token if token does not exists', async (assert) => {
    refreshTokenUseCase = new RefreshTokenUseCase(
      tokensRepositoryInMemory,
      usersRepositoryInMemory
    );

    try {
      await refreshTokenUseCase.execute('000000', authStubbed);
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
      assert.equal(
        error.message,
        i18n.formatMessage('messages.errors.not_found', { model: 'Token' })
      );
    }
  });

  test('it should not be able to refresh token if user does not exists', async (assert) => {
    refreshTokenUseCase = new RefreshTokenUseCase(
      tokensRepositoryInMemory,
      usersRepositoryInMemory
    );

    const token = await tokensRepositoryInMemory.store({
      expires_at: DateTime.now().plus({ minutes: 5 }),
      name: 'Token',
      token: crypto.randomBytes(32).toString('hex'),
      type: 'refresh_token',
      user_id: 1,
    });

    try {
      await refreshTokenUseCase.execute(token.token, authStubbed);
    } catch (error) {
      assert.instanceOf(error, NotFoundException);
      assert.equal(
        error.message,
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.user'),
        })
      );
    }
  });

  test('it should be able to refresh token', async (assert) => {
    refreshTokenUseCase = new RefreshTokenUseCase(
      tokensRepositoryInMemory,
      usersRepositoryInMemory
    );

    const user = await usersRepositoryInMemory.store({
      email: 'email@test.com',
      name: 'tester',
      password: '123456',
      username: 'tester',
    });

    const token = await tokensRepositoryInMemory.store({
      expires_at: DateTime.now().plus({ minutes: 5 }),
      name: 'Token',
      token: crypto.randomBytes(32).toString('hex'),
      type: 'refresh_token',
      user_id: user.id,
    });

    const tokens = await refreshTokenUseCase.execute(token.token, authStubbed);

    assert.property(tokens, 'access_token');
    assert.property(tokens, 'refresh_token');
  });
});
