# Random Index Template

一个最小可运行模板：`index.html` 读取 `config/pages.json` 后，按权重随机跳转到 `pages/` 中的页面。

## 功能

- 7 个 demo 页面
- 权重随机（`weight` 字段）
- 防重复随机（不会连续两次命中同一页面，除非只剩一个页面）
- 配置驱动扩展（新增页面只改 `config/pages.json`）
- 调试模式：`/index.html?page=demo-3`

## 本地运行

> 需要通过 HTTP 服务访问，不能直接双击打开 HTML（`fetch` 读取 JSON 会被浏览器限制）。

```bash
python3 -m http.server 8080
```

访问：

- http://localhost:8080/index.html

## 新增页面

1. 新建文件：`pages/demo-8.html`
2. 在 `config/pages.json` 追加：

```json
{ "id": "demo-8", "title": "Demo Page 8", "path": "/pages/demo-8.html", "enabled": true, "weight": 1 }
```

完成后无需修改 `index.html` 和 `js/router.js`。
