import { registerAs } from '@nestjs/config';
import { GENERAL_CONFIG } from '../common/constants/general';

export default registerAs(GENERAL_CONFIG, () => ({}));
