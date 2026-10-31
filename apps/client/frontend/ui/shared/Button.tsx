import { Text } from "nsh";
import { Button as BaseButton } from "nsh/base";

export function Button(props: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  id?: string;
  selected?: boolean;
}) {
  return (
    <BaseButton
      testID={props.id}
      accessibilityLabel={props.label}
      disabled={props.disabled}
      selected={props.selected}
      onPress={props.onPress}
      class="rounded-md border border-border px-3 py-2 hover:bg-muted disabled:opacity-40 selected:bg-accent"
    >
      <Text class="text-sm text-foreground">{props.label}</Text>
    </BaseButton>
  );
}
