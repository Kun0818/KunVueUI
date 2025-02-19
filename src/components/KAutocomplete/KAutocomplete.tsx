import { defineComponent, ref, computed, onMounted, onUnmounted, nextTick, Transition } from 'vue'
import type { PropType } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import './KAutocomplete.scss'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export default defineComponent({
  name: 'KSelect',
  props: {
    modelValue: {
      type: [String, Number] as PropType<string | number>,
      default: '',
    },
    options: {
      type: Array as PropType<SelectOption[]>,
      default: () => [],
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue', 'change'],

  setup(props, { emit }) {
    const isOpen = ref<boolean>(false)
    const selectRef = ref<HTMLDivElement | null>(null)
    const dropdownRef = ref<HTMLDivElement | null>(null)
    const isDropUp = ref<boolean>(false)
    const searchQuery = ref<string>('') // Bind search query to the input
    const highlightedIndex = ref<number | null>(null) // Track the currently highlighted option
    const filteredOptions = computed(() => {
      return props.options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.value.toLowerCase()),
      )
    })

    // const selectedLabel = computed<string>(() => {
    //   const selected = props.options.find((opt) => opt.value === props.modelValue)
    //   return selected?.label || ''
    // })

    const classes = computed(() => ({
      select: true,
      'is-open': isOpen.value,
      'has-value': !!props.modelValue,
      'is-disabled': props.disabled,
      'has-error': props.error,
    }))

    const handleOptionClick = (option: SelectOption) => {
      if (option.disabled) return
      emit('update:modelValue', option.value)
      emit('change', option.value)
      isOpen.value = false
      searchQuery.value = option.label
      //searchQuery.value = '' // Clear search query when option is selected
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
        isOpen.value = false
        //searchQuery.value = '' // Clear search query when clicking outside
      }
    }

    const toggleDropdown = () => {
      if (!props.disabled) {
        isOpen.value = !isOpen.value
        if (isOpen.value) {
          // Set highlightedIndex to 0 if there are options
          highlightedIndex.value = filteredOptions.value.length > 0 ? 0 : null
          checkDropdownPosition()
        }
      }
    }

    const checkDropdownPosition = () => {
      nextTick(() => {
        const selectRect = selectRef.value?.getBoundingClientRect()
        const dropdownHeight = dropdownRef.value?.offsetHeight || 0
        const viewportHeight = window.innerHeight

        if (selectRect) {
          isDropUp.value = selectRect.bottom + dropdownHeight > viewportHeight
        }
      })
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen.value) return
      console.log('here')

      switch (event.key) {
        case 'ArrowDown':
          // Move highlight down
          if (highlightedIndex.value === null) {
            highlightedIndex.value = 0
          } else if (highlightedIndex.value < filteredOptions.value.length - 1) {
            highlightedIndex.value++
          }
          break

        case 'ArrowUp':
          // Move highlight up
          if (highlightedIndex.value !== null && highlightedIndex.value > 0) {
            highlightedIndex.value--
          }
          break

        case 'Enter':
          // Select the highlighted option
          console.log('enter')

          if (highlightedIndex.value !== null) {
            console.log(highlightedIndex.value)

            const selectedOption = filteredOptions.value[highlightedIndex.value]
            console.log(selectedOption)

            handleOptionClick(selectedOption)
          }
          break

        default:
          return
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleOutsideClick)
      document.addEventListener('keydown', handleKeyDown) // Add keyboard event listener
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown) // Remove keyboard event listener
    })

    const dropdownClasses = computed(() => ({
      select__dropdown: true,
      'is-drop-up': isDropUp.value,
    }))

    return () => (
      <div class={classes.value}>
        <div class="select__wrapper" onClick={toggleDropdown}>
          {/* Autocomplete directly on the input field */}
          <input
            ref={selectRef}
            class="select__field"
            type="text"
            v-model={searchQuery.value} // Bind the input field to the search query
            placeholder={props.placeholder}
            disabled={props.disabled}
            title={props.label}
          />
          <div style="margin-right:16px;width:20px;height:20px">
            <ChevronDown class="select__arrow" size={20} />
          </div>
          <label class="select__label">{props.label}</label>
          <div class="select__outline">
            <div class="select__outline-notch"></div>
          </div>
        </div>

        <Transition name="fade">
          {isOpen.value && filteredOptions.value.length > 0 && (
            <div ref={dropdownRef} class={dropdownClasses.value}>
              {filteredOptions.value.map((option, index) => (
                <div
                  key={option.value}
                  class={{
                    select__option: true,
                    'is-selected': option.value === props.modelValue,
                    'is-disabled': option.disabled,
                    'is-highlighted': highlightedIndex.value === index, // Highlight the selected option
                  }}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </Transition>
      </div>
    )
  },
})
