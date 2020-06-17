import { toName, camelCase } from '../utils';

export const resource = (name: string) => `{
	"vi":{
		"${toName(name)}": "${toName(name)} (vi)"
	}, 
	"ja":{
		"${toName(name)}": "${toName(name)} (ja)"
	}
}`;

export const template = (name: string) => `<template>
    <div class="${toName(name)}">
        <markdown />
    </div>
</template>

<script lang="ts" src="./viewmodel.ts" />`;

export const viewmodel = (name: string) => `import { Vue, Component } from '@/app/provider';

@Component({
    markdowns: {
        vi: require('./contents/vi.md'),
        ja: require('./contents/ja.md')
    },
    resource: require('./resources.json')
})
export default class ${camelCase(name)}Component extends Vue {
}`;

export const markdown = `##### 1. Explaint
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
    name: 'sample',
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
`;