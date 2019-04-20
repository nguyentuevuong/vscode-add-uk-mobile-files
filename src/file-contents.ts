const $views = {
    style: (className: string) => `.${className} {\n\n}`,
    resource: (name: string) => `{
    "jp": {
        "${name}": "${name} (jp)"
    },
    "vi": {
        "${name}": "${name} (vi)"
    }
}`, template: (className: string) => `<template>
<div class="${className}">
    <h3>Hello {{title | i18n}} component!</h3>
    <nts-text-editor
        name='title'
        v-model='title' />
</div>
</template>`,
    viewmodel: (path: string, name: string, componentName: string) => `import { Vue } from '@app/provider';
import { component } from '@app/core/component';

@component({
    name: '${name}',
    route: '/${path}',
    style: require('./style.scss'),
    template: require('./index.vue'),
    resource: require('./resources.json'),
    validations: {},
    constraints: []
})
export class ${componentName}Component extends Vue {
    public title: string = '${componentName}';
}`
}, $component = (name: string, componentName: string) => `import { Vue } from '@app/provider';
import { component, Prop } from '@app/core/component';

@component({
    template: \`<div class="${name}">Hello {{title | i18n}} component!</div>\`
})
export class ${componentName}Component extends Vue {
    @Prop({ default: () => '${componentName}'})
    public readonly title!: string;
}`, $documents = {
        markdown: () => `##### 2. Explaint
> Sample quote

- First item list
- Second item list

**HTML Code:**
\`\`\`html
<div class="sample">
    <span>Sample html code</span>
</div>
\`\`\`

**Typescript code:**
\`\`\`typescript
class ClassName {
    constructor() {
        // sample contructor
    }

    choose() {
        // sample method
    }
}
\`\`\`

##### 3. API

id | name | content
----|----|------
id | name | content
`, resource: (name: string) => `{
    "jp": {
        "sample" : "Sample (jp)",
        "${name}": "${name} (jp)"
    },
    "vi": {
        "sample" : "Ví dụ",
        "${name}": "${name} (vi)"
    }
}`,
        template: (className: string) => `<template>
    <div class="${className}">
        <h5>1. {{'sample' | i18n}}</h5>

        <markdown />
    </div>
</template>`,
        viewmodel: (path: string, name: string, componentName: string) => `import { Vue } from '@app/provider';
import { component } from '@app/core/component';

@component({
    name: '${name}',
    route: { 
        url: '/${path}',
        parent: '/documents'
    },
    template: require('./index.vue'),
    resource: require('./resources.json'),
    markdown: {
        vi: require('./content/vi.md'),
        jp: require('./content/jp.md')
    }
})
export class ${componentName}Component extends Vue { }`
    };

export class FileContents {
    private toName(path: string, spc: string = ''): string {
        return path.replace(/(\\|\/)+/g, spc);
    }

    private camelCase(path: string): string {
        let name: string = this.toName(path, '-');

        return (name.charAt(0).toUpperCase() + name.slice(1)).replace(/-([a-z0-9])/ig, (all, letter) => letter.toUpperCase());
    }

    public views = {
        style: (path: string) => $views.style(this.toName(path)),
        resource: (path: string) => $views.resource(this.toName(path)),
        template: (path: string) => $views.template(this.toName(path)),
        viewmodel: (path: string) => $views.viewmodel(path.replace(/(\\|\/)+/g, '/'), this.toName(path), this.camelCase(path))
    };

    public documents = {
        markdown: () => $documents.markdown(),
        resource: (path: string) => $documents.resource(this.toName(path)),
        template: (path: string) => $documents.template(this.toName(path)),
        viewmodel: (path: string) => $documents.viewmodel(path.replace(/(\\|\/)+/g, '/').replace(/^documents\//, ''), this.toName(path), this.camelCase(path))
    };

    public components = {
        single: (path: string) => $component(this.toName(path), this.camelCase(path))
    }
}