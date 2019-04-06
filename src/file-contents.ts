const $style = (className: string) => `.${className} {\n\n}`,
    $resource = (name: string) => `{
    "jp": {
        "${name}": "${name} (jp)"
    },
    "vi": {
        "${name}": "${name} (vi)"
    }
}`,
    $template = (className: string) => `<div class="${className}">
    <h3>Hello {{title | i18n}} component!</h3>
    <nts-text-editor
        name='title'
        v-model='title' />
</div>`,
    $viewmodel = (path: string, name: string, componentName: string) => `import { Vue } from '@app/provider';
import { component } from '@app/core/component';

@component({
    name: '${name}',
    route: '/${path}',
    style: require('./style.scss'),
    template: require('./index.html'),
    resource: require('./resources.json'),
    validations: {},
    constraints: []
})
export class ${componentName}Component extends Vue {
    title: string = '${componentName}';
}`, $component = (name: string, componentName: string) => `import { Vue } from '@app/provider';
import { component, Prop } from '@app/core/component';

@component({
    template: \`<div class="${name}">Hello {{title | i18n}} component!</div>\`
})
export class ${componentName}Component extends Vue {
    @Prop({ default: () => '${componentName}'})
    title!: string;
}`;

export class FileContents {
    private toName(path: string, spc: string = ''): string {
        return path.replace(/(\\|\/)+/g, spc);
    }

    private camelCase(path: string): string {
        let name: string = this.toName(path, '-');

        return (name.charAt(0).toUpperCase() + name.slice(1)).replace(/-([a-z0-9])/ig, (all, letter) => letter.toUpperCase());
    }

    public cssContent(path: string): string {
        return $style(this.toName(path));
    }

    public resourceContent(path: string): string {
        return $resource(this.toName(path));
    }

    public templateContent(path: string): string {
        return $template(this.toName(path));
    }

    public componentContent(path: string): string {
        return $viewmodel(path.replace(/(\\|\/)+/g, '/'), this.toName(path), this.camelCase(path));
    }

    public singleComponent(path: string): string {
        return $component(this.toName(path), this.camelCase(path));
    }
}