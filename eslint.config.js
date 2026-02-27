import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';

export default [
    // Global ignores
    {
        ignores: ['build/**', 'node_modules/**', 'dist/**'],
    },

    // TypeScript + React source files
    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                clearInterval: 'readonly',
                setInterval: 'readonly',
                URL: 'readonly',
                alert: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'react-refresh': reactRefreshPlugin,
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            // TypeScript
            ...tsPlugin.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',

            // React
            ...reactPlugin.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',

            // React Hooks
            ...reactHooksPlugin.configs.recommended.rules,

            // React Refresh (Vite HMR)
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },

    // Disable formatting rules that conflict with Prettier
    prettierConfig,
];
