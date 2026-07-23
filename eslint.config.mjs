import eslint from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import oneLineImport from 'eslint-plugin-one-line-import'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      'node_modules/',
      'dist/',
      '.idea/',
      '.vscode/',
      'src/schematics/crud/files/ts/**/*.ts',
      'src/schematics/init/files/ts/**/*.ts',
      'src/schematics/use-case/files/ts/**/*.ts'
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
  },
  eslintPluginPrettierRecommended,
  {
    plugins: { 'one-line-import': oneLineImport },
    rules: {
      'one-line-import/one-line-import': 'error',
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            'vitest.config.ts',
            'tsdown.config.ts',
            'prettier.config.mjs',
            'test/*.ts',
          ],
        },
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-optional-chaining': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/unbound-method': 'off',
    }
  }
)
