import { View, Text, Scroll, type JSX } from 'nsh'
import { Dialog } from 'nsh/base'
import { Button } from './Button'

export function DialogFrame(props: { title: string; close(): void; children?: JSX.Element; busy?: boolean }) {
  return <Dialog open closeOnEscape={!props.busy} closeOnBackdropPress={!props.busy} onOpenChange={open => { if (!open) props.close() }} backdropClass="bg-black/40" class="w-[640px] max-w-[90%] max-h-[85%] rounded-xl border border-border bg-background p-5">
    <View class="gap-4">
      <View class="flex-row items-center gap-3">
        <Text class="flex-1 text-lg font-semibold text-foreground">{props.title}</Text>
        <Button id="dialog-close" label="关闭" disabled={props.busy} onPress={props.close} />
      </View>
      <Scroll><View class="gap-3">{props.children}</View></Scroll>
    </View>
  </Dialog>
}
