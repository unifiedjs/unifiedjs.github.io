/**
 * @import {FlatXoConfig} from 'xo'
 */

import globals from 'globals'

/** @type {FlatXoConfig} */
const xoConfig = [
  {
    name: 'default',
    prettier: true,
    rules: {
      complexity: 'off',
      'no-await-in-loop': 'off',
      'prefer-destructuring': 'off',
      'unicorn/no-process-exit': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': ['error', {replacements: {src: false}}],
      'unicorn/prefer-query-selector': 'off'
    },
    space: true
  },
  {
    languageOptions: {globals: globals.browser},
    files: ['asset/**/*.js'],
    rules: {'promise/prefer-await-to-then': 'off'}
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  }
]

export default xoConfig
