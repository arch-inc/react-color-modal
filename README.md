### react-color-modal

[![build](https://github.com/arch-inc/react-color-modal/workflows/npm-publish/badge.svg)](https://github.com/arch-inc/react-color-modal/actions?query=workflow%3Anpm-publish)
[![npm version](https://img.shields.io/npm/v/@arch-inc/react-color-modal)](https://www.npmjs.com/package/@arch-inc/react-color-modal)

**react-color-modal** is yet another color picker component for React.

**react-color-modal** は React 用の軽量なカラーパレットです。

- npm package: https://www.npmjs.com/package/@arch-inc/react-color-modal
- API document: https://arch-inc.github.io/react-color-modal/api/globals.html
- Demo site: https://arch-inc.github.io/react-color-modal/

### Usage / 使い方

Simply install the npm package and start using it. TypeScript definitions are available by default. (e.g., [index.d.ts](https://cdn.jsdelivr.net/npm/@arch-inc/react-color-modal@latest/dist/index.d.ts))

`npm install` でインストールできます。 TypeScript の型定義がついてきます。

```sh
npm i @arch-inc/react-color-modal
```

```jsx
import { useState } from "react";
import { ColorPanel } from "@arch-inc/react-color-modal";

export const Body = () => {
  // tinycolor instance
  const [color, setColor] = useState(null);

  // render a color panel with simple status indicator
  return (
    <>
      <ColorPanel onColorUpdate={setColor} />
      {color && (
        <p>
          Selected color:{" "}
          <span style={{ backgroundColor: color.toHexString() }} />{" "}
          <code>{color.toHexString()}</code>
        </p>
      )}
    </>
  );
};
```

### API Documentation / API ドキュメント

All of the exported classes and interfaces are listed in [TypeDoc](https://arch-inc.github.io/react-color-modal/api/globals.html).

このモジュールが export しているすべてのクラスとインタフェースは [TypeDoc](https://arch-inc.github.io/react-color-modal/api/globals.html) で閲覧できます。

### Credits / 開発者

- [Jun Kato](https://junkato.jp), developer

### Dependencies / 依存パッケージ

- [React](https://reactjs.org)
- [react-input-slider](https://github.com/swiftcarrot/react-input-slider)
- [styled-components](https://styled-components.com)
- [tinycolor2](http://bgrins.github.io/TinyColor)

### Staying in touch / 開発者に連絡

We have developed this extension in collaboration with the core developers of Fabric.js and relevant information can be found in their issue tracker.

Twitter [@ArchResearchJp](https://twitter.com/ArchResearchJp) で連絡がつきます。

### Library in action / 利用例

- [Demo site](https://arch-inc.github.io/react-color-modal/): GitHub Pages accompanied with this library

---

Copyright (c) 2020 Arch Inc. (Jun Kato)
