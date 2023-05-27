module.exports = (api) => {
  const isTest = api.env("test");
  if (isTest) {
    return {
      presets: [
        "@babel/preset-env",
        ["@babel/preset-react", { runtime: "automatic" }],
      ],
    };
  } else {
    api.cache(true);
    return {
      presets: [
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'usage',
            corejs: 3,
          },
        ],
        [
          '@babel/preset-react',
          { runtime: 'automatic', importSource: 'react-library/react' },
        ],
      ],
    };
  }
};
