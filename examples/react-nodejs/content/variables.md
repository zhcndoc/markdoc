---
route: '/variables'
---

这行下面有一条消息。你能想办法让它显示出来吗？

{% if $flags.show_secret_feature %}
这是特殊的隐藏文本！
{% /if %}
