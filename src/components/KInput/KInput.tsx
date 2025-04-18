// src/components/input/Input.tsx
import { defineComponent, computed, ref } from 'vue'
import './KInput.scss'

export interface InputProps {
  modelValue: string | number
  label: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
}

export default defineComponent({
  name: 'KInput',

  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: undefined,
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

  emits: ['update:modelValue', 'focus', 'blur'],

  setup(props, { emit }) {
    const inputRef = ref<HTMLInputElement | null>(null)
    const isFocused = ref(false)

    const classes = computed(() => ({
      'floating-input': true,
      'is-focused': isFocused.value,
      'has-value': !!props.modelValue,
      // 'is-disabled': props.disabled,
      'has-error': props.error,
    }))

    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      emit('update:modelValue', target.value)
    }

    const handleFocus = (event: FocusEvent) => {
      if (!props.disabled) {
        isFocused.value = true
        emit('focus', event)
      }
    }

    const handleBlur = (event: FocusEvent) => {
      isFocused.value = false
      emit('blur', event)
    }

    return () => (
      <div class={classes.value}>
        <div class="floating-input__wrapper">
          <label class="floating-input__label">{props.label}</label>
          <input
            ref={inputRef}
            class="floating-input__field"
            value={props.modelValue}
            placeholder={props.placeholder}
            disabled={props.disabled}
            onInput={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            title={props.label}
          />
          <div class="floating-input__outline">
            <div class="floating-input__outline-start"></div>
            <div class="floating-input__outline-notch">
              <label class="floating-input__label--floating">{props.label}</label>
            </div>
            <div class="floating-input__outline-end"></div>
          </div>
        </div>
      </div>
    )
  },
})
