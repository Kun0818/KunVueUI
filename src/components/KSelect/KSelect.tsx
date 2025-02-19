// src/components/select/Select.tsx
import { defineComponent, ref, computed, onMounted, onUnmounted, nextTick, Transition } from 'vue'
import type { PropType } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import './KSelect.scss'

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
    const selectedLabel = computed<string>(() => {
      const selected = props.options.find((opt) => opt.value === props.modelValue)
      return selected?.label || ''
    })

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
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
        isOpen.value = false
      }
    }

    const toggleDropdown = () => {
      if (!props.disabled) {
        isOpen.value = !isOpen.value
        if (isOpen.value) {
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

    onMounted(() => {
      document.addEventListener('click', handleOutsideClick)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleOutsideClick)
    })

    const dropdownClasses = computed(() => ({
      select__dropdown: true,
      'is-drop-up': isDropUp.value,
    }))

    return () => (
      <div class={classes.value}>
        <div class="select__wrapper" onClick={toggleDropdown}>
          <input
            ref={selectRef}
            class="select__field"
            type="text"
            value={selectedLabel.value}
            placeholder={props.placeholder}
            disabled={props.disabled}
            title={props.label}
            readonly
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
          {isOpen.value && (
            <div ref={dropdownRef} class={dropdownClasses.value}>
              {props.options.map((option) => (
                <div
                  key={option.value}
                  class={{
                    select__option: true,
                    'is-selected': option.value === props.modelValue,
                    'is-disabled': option.disabled,
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
