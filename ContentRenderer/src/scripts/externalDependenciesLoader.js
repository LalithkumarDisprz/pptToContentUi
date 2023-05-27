import {
  createScriptLoader,
  createStylesheetLoader,
} from '@bigcommerce/script-loader';
import externalDependencies from '../../externalDependencies.json';

const scriptLoader = createScriptLoader();
const cssLoader = createStylesheetLoader();

const SupportedFileTypes = {
  JS: 'js',
  CSS: 'css',
};

const loadJSFiles = (deps) => {
  deps.forEach((dep) => {
    if (typeof dep === 'string') {
      scriptLoader.loadScript(dep);
    } else {
      const { src, ...rest } = dep;
      scriptLoader.loadScript(src, { ...rest });
    }
  });
};

const loadCSSFiles = (deps) => {
  deps.forEach((dep) => {
    cssLoader.loadStylesheet(dep);
  });
};

const loadAllExternals = () => {
  Object.entries(externalDependencies).forEach(([key, value]) => {
    switch (key) {
      case SupportedFileTypes.JS:
        loadJSFiles(value);
        break;
      case SupportedFileTypes.CSS:
        loadCSSFiles(value);
        break;
      default:
        console.log('Unable to handle this type of files', key);
        break;
    }
  });
};

loadAllExternals();
