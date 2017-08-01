---
layout: style-guide
---

Collection of UI components used in the Couchbase Jekyll theme.

{% assign componentsByType = site.components | group_by:"type" %}

{% for type in componentsByType %}
<h2 id="guide--{{ type.name }}">{{ type.name }}</h2>
{% for entry in type.items %}
{% include component.html %}
{% endfor %}
{% endfor %}