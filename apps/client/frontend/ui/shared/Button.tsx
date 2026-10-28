import { View, Text } from 'nsh'

export function Button(props: { label: string; onPress: () => void; disabled?: boolean; id?: string }) {
  return <View role="button" testID={props.id} accessibilityLabel={props.label} disabled={props.disabled} onPress={props.onPress}
    class="rounded-md border border-border px-3 py-2 hover:bg-muted disabled:opacity-40">
    <Text class="text-sm text-foreground">{props.label}</Text>
  </View>
}
