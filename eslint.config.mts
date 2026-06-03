import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['./src/**/*.{js,mjs,cjs,ts}']
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig, // Подключаем конфигурацию Prettier для отключения конфликтующих правил
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-empty-pattern': 'off',
      'no-useless-catch': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-useless-escape': 'off'

      // "max-len": ["off", { code: 120 }],
      // '@typescript-eslint/no-explicit-any': 'off',
    }
  },
  {
    ignores: [
      'node_modules/**',
      'mochawesome-report/**',
      'husky/**',
      '*.json',
      'package-lock.json',
      'package-lock.json',
      'data.generator.ts',
      'src/helpers/**',
      'configuration.ts',
      'src/clients/**'
    ]
  }
];
