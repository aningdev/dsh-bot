import { View, Text, List } from 'nsh'
import type { Workbench } from '../../application/conversation/controller'

export function MessageList(props: { model: Workbench }) {
  const { messages } = props.model
  return <View selectable class="flex-1">
    <List each={messages()} keyExtractor={item => item.id} estimatedItemSize={100} class="flex-1"
      contentStyle={{ padding: 24, gap: 12 }} maintainVisibleContentPosition={{ autoscrollToBottomThreshold: 50 }}>
      {item => {
        const user = () => item().role === 'user'
        return <View class={user() ? 'items-end' : 'items-start'}>
          <View class={user()
            ? 'max-w-[85%] rounded-2xl bg-primary px-3.5 py-2.5'
            : 'max-w-[85%] rounded-2xl bg-muted px-3.5 py-2.5'}>
            <Text class={user() ? 'text-base text-primary-foreground' : 'text-base text-foreground'}>{item().text}</Text>
          </View>
        </View>
      }}
    </List>
  </View>
}
