import { defineAppConfig } from 'ice';
import './i18n';

import './font.css';


// App config, see https://v3.ice.work/docs/guide/basic/app
export default defineAppConfig(() => ({
    // Set your configs here.
    router: {
      // basename: '/fabritor-web',

      // 开发环境不设置 basename，生产环境设置
    basename: process.env.NODE_ENV === 'production' ? '/fabritor-web' : '/',
    },
  }));