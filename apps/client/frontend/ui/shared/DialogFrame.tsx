import { View, Text, Scroll, type JSX } from 'nsh'
import { Button as BaseButton, Dialog } from 'nsh/base'

/** Centered form dialog: gallery System/Form pattern on `nsh/base` Dialog. */
export function DialogFrame(props: {
  title: string
  close(): void
  children?: JSX.Element
  busy?: boolean
  footer?: JSX.Element
}) {
  return (
    <Dialog
      open
      closeOnEscape={!props.busy}
      closeOnBackdropPress={!props.busy}
      onOpenChange={(open) => { if (!open) props.close() }}
      backdropClass="bg-black/40"
      class="w-[560px] max-w-[92%] max-h-[85%] overflow-hidden rounded-xl border border-border bg-background shadow-xl"
    >
      <View class="gap-0">
        <View class="flex-row items-center gap-3 border-b border-border px-5 py-4">
          <Text class="flex-1 text-lg font-semibold text-foreground">{props.title}</Text>
          <BaseButton testID="dialog-close" accessibilityLabel="关闭" disabled={props.busy}
            onPress={props.close}
            class="rounded-md border border-border px-3 py-1.5 hover:bg-muted disabled:opacity-40 active:opacity-70">
            <Text class="text-sm text-foreground">关闭</Text>
          </BaseButton>
        </View>
        <Scroll class="max-h-[520px]">
          <View class="gap-4 px-5 py-4">{props.children}</View>
        </Scroll>
        {props.footer ? <View class="flex-row justify-end gap-2 border-t border-border px-5 py-3">{props.footer}</View> : null}
      </View>
    </Dialog>
  )
}
