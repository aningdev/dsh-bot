import { Text, View } from 'nsh'
import { Menu, MenuItem } from 'nsh/base'

export type SelectOption = { value: string; label: string; disabled?: boolean; id?: string }

/** Gallery-style choice control: `nsh/base` Menu as a select (no dedicated Select in base). */
export function Select(props: {
  id?: string
  label: string
  value: string
  options: SelectOption[]
  disabled?: boolean
  placeholder?: string
  onChange(value: string): void
}) {
  const selected = () => props.options.find(item => item.value === props.value)
  const title = () => selected()?.label || props.placeholder || '请选择'
  return <Menu
    offset={4}
    placement="bottom"
    align="start"
    popupClass="min-w-56 max-h-72 overflow-hidden rounded-lg border border-border bg-background p-1 shadow-lg"
    backdropClass="bg-black/20"
    trigger={<View testID={props.id} role="button" accessibilityLabel={props.label}
      accessibilityState={{ disabled: !!props.disabled }}
      class={props.disabled
        ? 'flex-row items-center gap-2 rounded-md border border-border bg-muted px-3 py-2 opacity-40'
        : 'flex-row items-center gap-2 rounded-md border border-border bg-background px-3 py-2 hover:bg-muted active:opacity-80'}>
      <Text class="flex-1 text-sm text-foreground" numberOfLines={1}>{title()}</Text>
      <Text class="text-xs text-muted-foreground">▾</Text>
    </View>}>
    {props.disabled ? null : props.options.map(item =>
      <MenuItem disabled={item.disabled}
        testID={item.id}
        accessibilityLabel={item.label}
        onSelect={() => props.onChange(item.value)}
        class={item.value === props.value
          ? 'rounded-md bg-accent px-3 py-2'
          : 'rounded-md px-3 py-2 hover:bg-muted active:bg-accent'}>
        <Text class="text-sm text-foreground">{item.label}</Text>
      </MenuItem>)}
  </Menu>
}
