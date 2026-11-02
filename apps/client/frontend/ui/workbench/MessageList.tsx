import { View, Text, List } from 'nsh'
import type { Workbench } from '../../application/conversation/controller'

/** Gallery Chat-style bubbles: user right/primary, assistant left/muted. */
export function MessageList(props: { model: Workbench }) {
  const { messages } = props.model
  return <View selectable class="flex-1">
    <List each={messages()} keyExtractor={item => item.id} estimatedItemSize={120} class="flex-1"
      contentStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20, gap: 10 }}
      maintainVisibleContentPosition={{ autoscrollToBottomThreshold: 40 }}>
      {item => {
        const user = () => item().role === 'user'
        return <View class="w-full items-center">
          <View class={user() ? 'w-full max-w-[820px] items-end' : 'w-full max-w-[820px] items-start'}>
            <View class={user()
              ? 'max-w-[85%] rounded-[20px] bg-primary px-3.5 py-2.5'
              : 'max-w-[85%] rounded-[20px] border border-border bg-muted px-3.5 py-2.5'}>
              <Text class={user() ? 'text-[15px] leading-5 text-primary-foreground' : 'text-[15px] leading-5 text-foreground'}>{item().text}</Text>
            </View>
          </View>
        </View>
      }}
    </List>
  </View>
}
