import { registerAs } from '@nestjs/config';
import {
  SERVICES_CONFIG,
  VERCEL_TEST_SERVICE,
} from '../common/constants/general';
import { getEnv } from '../common/utils/string.util';

export default registerAs(SERVICES_CONFIG, () => {
  return {
    [VERCEL_TEST_SERVICE]: {
      endpoint: getEnv('VERCEL_TEST_SERVICE_ENDPOINT', ''),
    },
  };
});
