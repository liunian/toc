根据 h1 ~ h6 来生成目录
---

引入 `dist/toc.js` 即可

### 开发

- `npm install`
- `bower install`
- `npm test` 来执行测试
- `npm run build` 或 `gulp` 来 build

> `index.js` 中使用了 `@css@` 来表示 css 占位符，故相关 js 中非输出样式处不应使用这个字符串

- `Chapter.js` 表示一个章节，其下可有子章节
- `Toc.js` 表示整个目录
- `index.js` 是针对 Github 和 Gitlab 的入口
