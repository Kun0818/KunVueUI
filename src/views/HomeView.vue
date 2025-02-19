<script setup lang="ts">
import KInput from '@/components/KInput/KInput'
import KSelect from '@/components/KSelect/KSelect'
import KButton from '@/components/KButton/KButton'
import KAutocomplete from '@/components/KAutocomplete/KAutocomplete'
import type { SelectOption } from '@/components/KSelect/Type'
import { ref } from 'vue'

const item = ref('')
const item2 = ref('')

const optionsList: SelectOption[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3', disabled: true },
  { label: 'Option 4', value: '4' },
  { label: 'Option 5', value: '6' },
  { label: 'Option 7', value: '7' },
  { label: 'Option 8', value: '8' },
  { label: 'Option 9', value: '9' },
  { label: 'Option 10', value: '10' },
]

const autocompleteList: SelectOption[] = [
  { label: 'apple', value: '1' },
  { label: 'banana', value: '2' },
  { label: 'orange', value: '3', disabled: true },
  { label: 'pig', value: '4' },
]

const input = ref('')

// const isLoading = ref(false)

// const handleClick = () => {
//   console.log('Button clicked!')
// }
</script>

<template>
  <k-input label="Input" v-model="input"></k-input>
  <hr />
  <k-select
    v-model="item"
    :options="optionsList"
    label="Select"
    placeholder="Choose an option"
  ></k-select>
  <hr />
  <!-- <KButton variant="primary" style-type="outlined" icon-end="ThumbsUp"> Like </KButton>
  <KButton variant="primary" style-type="fill" icon-start="ThumbsUp"> Like </KButton>
  <KButton variant="primary" style-type="fill" icon-start="ThumbsUp" disabled> Like </KButton>
  <hr />
  <KButton variant="secondary" style-type="outlined" icon-end="ThumbsUp"> Like </KButton>
  <KButton variant="secondary" style-type="fill" icon-start="ThumbsUp"> Like </KButton>
  <KButton variant="secondary" style-type="fill" icon-start="ThumbsUp" disabled> Like </KButton>
  <hr />
  <KButton variant="error" style-type="outlined" icon-end="ThumbsUp"> Like </KButton>
  <KButton variant="error" style-type="fill" icon-start="ThumbsUp"> Like </KButton>
  <KButton variant="error" style-type="fill" icon-start="ThumbsUp" disabled> Like </KButton>
  <hr />  -->
  <!-- <KAutocomplete
    v-model="item2"
    :options="autocompleteList"
    label="Select"
    placeholder="Choose an option"
  ></KAutocomplete> -->
</template>
