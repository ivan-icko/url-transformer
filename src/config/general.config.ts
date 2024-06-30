import { registerAs } from '@nestjs/config';
import { GENERAL_CONFIG } from 'src/common/constants/general';

export default registerAs(GENERAL_CONFIG, () => ({}));
