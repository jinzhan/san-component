# san-component

对san.Component的增强，方便大型项目定义全局组件。

## How to use

首先，根据业务需要对集成常用的Compontents，并export出来。

```

import {SanComponent, registerComponents, registerMixins} from 'san-component';


import {
    Alert,
    Button,
    Icon,
    Form
} from 'santd';

const defaultCompontents = {
    's-alert': Alert,
    's-button': Button,
    's-icon': Icon,
    's-form': Form,
};

const mixinMethod = {
    sayHi() {
        console.log('Hi');
    }
};

registerComponents(defaultCompontents);
registerMixins(mixinMethod);

export default SanComponent;
```


然后，业务中就可以使用SanComponent代替默认的san.Component了。

```
import Component from 'your-path/san-component';

export default class MyComponent extends Component {
    ...
}

```
