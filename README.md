## Style Guide

### Headers

The only rule for headers is that a top level header should be an `h2` (##).

### Images

- Create an **img** folder in the same directory as the markdown file.
- Save images to the **img** and reference them in markdown like so: `![](img/image01.png)`.

### Notes

We use the markdown quote syntax to render notes.

```
> **Note:** some text
```

![](https://cl.ly/460L1w061U0g/Pasted_Image_09_09_2016__21_16.png)

### Tables

We follow the markdown syntax for tables. Here's an example.

```
|Column 1|Column 2|Column 3|
|:-------|:-------|:-------|
|Value 1|Value 2|Value 3|
```

### Ordered lists

```
1. First
2. Second
3. Third
```

### Unordered lists

```
- Text
- Text
- Text
```

### Code snippets

    ```java
    code
    ```

### Code tabs (mobile docs only)

For code tabs we're using a slight _hack_ to make it work in markdown. The following will render the image below.


    <div class="tabs" />
    
    ```objective-c+
    code
    ```
    
    ```swift+
    code
    ```
    
    ```c+
    code
    ```
    
    ```java+android+
    same code for java linux and android
    ```
    
    ```java+
    code
    ```
    
    ```android+
    code
    ```

![](https://cl.ly/2s111n2z1k2m/Pasted_Image_09_09_2016__22_04.png)