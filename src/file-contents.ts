const resources = (name: string) => `{
	"vi":{
		"${name.toLowerCase()}": "${name} (vi)"
	}, 
	"ja":{
		"${name.toLowerCase()}": "${name} (ja)"
	}
}`,
    $view = {
        template: (name: string) => `<template>
    <div class="${name.toLowerCase()}">
        <v-validate />
        <!-- design template view at below -->
    </div>
</template>

<script lang="ts" src="./viewmodel.ts"></script>
<style lang="scss" scoped>
    .${name.toLowerCase()} {
        margin: 0;
        padding: 0;
        // add some style at here
    }
</style>`,
        viewmodel: (name: string) => `import { Vue, Component } from '@/app/provider';

@Component({
    resources: require('./resources.json'),
    validations: {
        // add validators at here
    },
    constraints: [
        // add constraints name at here   
    ],
    enums: [
        // add enums name at here
    ]
})
export default class ${name}Component extends Vue {
    // add you bussiness logic code at here
}`
    }, $document = {
        template: (name: string) => `<template>
    <div class="${name.toLowerCase()}">
        <v-markdown />
    </div>
</template>

<script lang="ts" src="./viewmodel.ts"></script>`,
        viewmodel: (name: string) => `import { Vue, Component } from '@/app/provider';

@Component({
    markdowns: {
        vi: require('./contents/vi.md'),
        ja: require('./contents/ja.md')
    },
    resources: require('./resources.json')
})
export default class ${name}Component extends Vue {
}`,
        markdown: `##### 1. Explaint
> Sample quote

- First item list
- Second item list

##### 2. Template
\`\`\`html
<template>
    <div class="sample">
        <v-validate />
        <!-- design template view at below -->
    </div>
</template>

<script lang="ts" src="./viewmodel.ts"></script>
<style lang="scss" scoped>
    .sample {
        // add some style at here
    }
</style>
\`\`\`

##### 3. Viewmodel
\`\`\`typescript
import { Vue, Component } from '@/app/provider';

@Component({
    resources: {
        vi: {
            sample: 'sample'
        },
        ja: {
            sample: 'sample'
        }
    },
    validations: {
        // add validators at here
    },
    constraints: [
        // add constraints name at here   
    ],
    enums: [
        // add enums name at here
    ]
})
export default class SampleComponent extends Vue {
    // add you bussiness logic code at here
}
\`\`\`

##### 4. API

id | name | content
----|----|------
id | name | content
`
    };

const toName = (path: string, spc: string = ''): string => {
    return path.replace(/(\\|\/)+/g, spc);
};

const camelCase = (path: string): string => {
    let name: string = toName(path, '-');

    return (name.charAt(0).toUpperCase() + name.slice(1)).replace(/-([a-z0-9])/ig, (all, letter) => letter.toUpperCase());
};

export const view = {
    resource: (path: string) => resources(camelCase(path)),
    template: (path: string) => $view.template(camelCase(path)),
    viewmodel: (path: string) => $view.viewmodel(camelCase(path))
};

export const document = {
    markdown: () => $document.markdown,
    resource: (path: string) => resources(camelCase(path)),
    template: (path: string) => $document.template(camelCase(path)),
    viewmodel: (path: string) => $document.viewmodel(camelCase(path))
};