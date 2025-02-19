import { defineComponent, type PropType, h } from 'vue'
import * as Icons from 'lucide-vue-next'
import type { FunctionalComponent } from 'vue'
import './KButton.scss'

export type ButtonVariant = 'primary' | 'secondary' | 'error'
export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonStyle = 'fill' | 'outlined'
export type IconNames = keyof typeof Icons

// 定義圖標尺寸映射
const ICON_SIZES = {
  small: 16,
  medium: 20,
  large: 24,
} as const

// 包裝 Lucide 圖標為 Vue 元件
const getIconComponent = (iconName: IconNames, size: number) => {
  const Icon = Icons[iconName] as FunctionalComponent
  return Icon ? defineComponent({
    render: () => h(Icon, { size })
  }) : null
}

export default defineComponent({
  name: 'KButton',
  props: {
    variant: {
      type: String as PropType<ButtonVariant>,
      default: 'primary',
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: 'medium',
    },
    styleType: {
      type: String as PropType<ButtonStyle>,
      default: 'fill',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    iconStart: {
      type: String as PropType<IconNames>,
      default: null,
    },
    iconEnd: {
      type: String as PropType<IconNames>,
      default: null,
    },
    // 可以單獨設置圖標尺寸
    iconSize: {
      type: Number,
      default: null,
    },
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    const handleClick = (event: MouseEvent) => {
      if (props.loading || props.disabled) return
      emit('click', event)
    }

    const renderIcon = (iconName: IconNames) => {
      // 使用自定義尺寸或根據按鈕尺寸選擇預設值
      const size = props.iconSize || ICON_SIZES[props.size]
      const IconComponent = getIconComponent(iconName, size)
      return IconComponent ? h(IconComponent) : null
    }

    return () => (
      <button
        type="button"
        class={[
          'k-button',
          `k-button--${props.variant}`,
          `k-button--${props.size}`,
          `k-button--${props.styleType}`,
          {
            'is-loading': props.loading,
          },
        ]}
        disabled={props.disabled || props.loading}
        onClick={handleClick}
      >
        {props.loading ? (
          <span class="k-button__spinner"></span>
        ) : (
          <>
            {props.iconStart && (
              <span class="k-button__icon k-button__icon--left">
                {renderIcon(props.iconStart)}
              </span>
            )}
            {slots.default && <span class="k-button__label">{slots.default()}</span>}
            {props.iconEnd && (
              <span class="k-button__icon k-button__icon--right">
                {renderIcon(props.iconEnd)}
              </span>
            )}
          </>
        )}
      </button>
    )
  },
})