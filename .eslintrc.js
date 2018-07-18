module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  parser: 'babel-eslint',
  plugins: ['import', 'react', 'jsx-a11y'],
  env: {
    commonjs: true,
    es6: true,
    browser: true,
    node: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  globals: {
    __DEV__: true
  },
  rules: {
    'max-len': 'off',
    indent: ['error', 2, { SwitchCase: 1 }],
    semi: ['error', 'never'],
    'no-trailing-spaces': ['error'],
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', 'always-multiline'],
    'import/extensions': ['off'],
    'react/sort-comp': ['off'],
    'react/display-name': ['off'],
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/prefer-stateless-function': ['off', { ignorePureComponents: true }]
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src']
      }
    }
  }
}
