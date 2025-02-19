import type { App } from 'vue';
import * as components from './components';

// 分別匯出所有的元件，讓使用者可以按需引入
export * from './components';

// 定義安裝方法，讓元件庫可以透過 app.use() 全局安裝
const install = (app: App) => {
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
  });
};

// 匯出一個物件，包含 install 方法
export default {
  install,
};
