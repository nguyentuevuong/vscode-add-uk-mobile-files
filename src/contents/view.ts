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
        <!-- design template view at below -->
    </div>
</template>

<script lang="ts" src="./viewmodel.ts" />

<style lang="scss" scoped>
.${toName(name)} {
    margin: 0;
    padding: 0;
    // add some style at here
}
</style>`;

export const viewmodel = (name: string) => `import { Vue, Component } from '@/app/provider';

@Component({
    resource: require('./resources.json'),
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
export default class ${camelCase(name)}Component extends Vue {
    // add you bussiness logic code at here
}`