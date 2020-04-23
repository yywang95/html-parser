# html-parser

html内容转为dom tree结构

```html
<div>
    <span>test</span>
    <img src="http://github.com" />
<div>
```

```json
{
    "type": "tag",
    "tagName": "div",
    "props": {},
    "children": [{
        "type": "tag",
        "tagName": "span",
        "props": {},
        "children": [{
            "type": "text",
            "content": "test"
        }]
    }, {
        "type": "tag",
        "tagName": "img",
        "props": {
            "src": "http://github.com"
        }
    }]
}
```
