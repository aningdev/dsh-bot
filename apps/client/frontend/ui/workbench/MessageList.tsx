import { View, Text, List } from 'nsh'
import { Button } from '../shared/Button'
import type { Workbench } from '../../application/conversation/controller'
export function MessageList(props: { model: Workbench }) {
  const { messages } = props.model
  return <>
        <View selectable style={{ flex: 1 }}>
          <List each={messages()} keyExtractor={item => item.id} estimatedItemSize={100} style={{ flex: 1 }}
            contentStyle={{ padding: 24, gap: 18 }} maintainVisibleContentPosition={{ autoscrollToBottomThreshold: 50 }}>
            {item => <View class="gap-2">
              <Text class="text-xs text-muted-foreground">{item().role === 'user' ? '你' : 'Agent'}</Text>
              <Text class="text-base text-foreground">{item().text}</Text>
            </View>}
          </List>
        </View>
  </>
}
