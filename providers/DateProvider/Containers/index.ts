import { container } from 'tsyringe';

import { DateContract } from 'Contracts/date';
import { DateProvider } from '../index';

container.registerSingleton<DateContract>('DateProvider', DateProvider);
