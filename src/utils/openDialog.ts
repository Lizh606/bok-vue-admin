import { ElButton, ElDialog, ElMessage } from "element-plus"
import {
  createApp,
  h,
  ref,
  shallowRef,
  type Component,
  type ShallowRef
} from "vue"

interface DialogModelProps {
  modelValue?: boolean
  title?: string
  width?: string | number
  fullscreen?: boolean
  [key: string]: any
}

interface DialogSlotProps {
  header?: () => any
  footer?: () => any
  [key: string]: any
}

const openDialog = <T extends Component, P extends Record<string, any>>(
  component: T,
  componentProps: P,
  modelProps: DialogModelProps = {},
  slotProps: DialogSlotProps = {}
) => {
  const instance = shallowRef()
  const modelValue = ref(true)
  const dialog = () => {
    return h(
      ElDialog,
      {
        ...modelProps,
        modelValue: modelValue.value,
        onClose: () => {
          unMounted()
        }
      },
      {
        default: () =>
          h(component, {
            ref: instance,
            ...componentProps
          }),
        ...slotProps
      }
    )
  }
  const app = createApp(dialog)
  const div = document.createElement("div")
  document.body.appendChild(div)
  app.mount(div)
  const unMounted = () => {
    modelValue.value = false
    app.unmount()
    document.body.removeChild(div)
  }
  return {
    unMounted,
    instance: instance as ShallowRef<T>
  }
}
interface DeleteDialogOptions {
  content: string
  onDelete: () => Promise<void>
  onSuccess?: () => void
  title?: string
  confirmText?: string
  cancelText?: string
  successMessage?: string
}
const openDeleteDialog = (options: DeleteDialogOptions) => {
  const {
    content,
    onDelete,
    onSuccess,
    title = "确认删除",
    confirmText = "确认",
    cancelText = "取消",
    successMessage
  } = options
  const contentNode = h(
    "div",
    {
      class: "tw-text-red-500"
    },
    content
  )
  const { unMounted } = openDialog(
    contentNode,
    {},
    {
      title: title,
      width: 500,
      draggable: true
    },
    {
      footer: () => {
        return h(
          "div",
          {
            class: "tw-flex tw-justify-end tw-gap-2"
          },
          [
            h(
              ElButton,
              {
                onClick: () => {
                  unMounted()
                }
              },
              () => cancelText
            ),
            h(
              ElButton,
            {
              type: "primary",
              onClick: async () => {
                try {
                  await onDelete()
                  unMounted()
                  onSuccess?.()
                    if (successMessage) {
                      ElMessage.success(successMessage)
                    }
                } catch (error) {
                  console.error(error)
                }
              }
            },
              () => confirmText
            )
          ]
        )
      }
    }
  )
}
export { openDeleteDialog, openDialog }
