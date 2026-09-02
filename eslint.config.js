import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

// 规范详见 specs/10 §4；prettier 配置置于最后以关闭冲突的格式规则
export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'unpackage/**', 'src/static/**']
  },
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue']
      }
    }
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  },
  prettier
)
