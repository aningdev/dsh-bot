import { View, signal } from 'nsh'
import { Button as BaseButton, ResizablePanel, ResizablePanelGroup } from 'nsh/base'
import { Text } from 'nsh'
import type { Workbench } from '../../application/conversation/controller'
import { BotSidebar } from './BotSidebar'
import { ConversationView } from './ConversationView'
import { BotInspector } from './BotInspector'
import { CreateBotDialog } from './CreateBotDialog'
import { BotSettingsDialog } from './BotSettingsDialog'
import { ApprovalDialog } from './ApprovalDialog'

export function WorkbenchPage(props: { model: Workbench; openSettings(): void }) {
  const dialog = signal<'bot' | 'approval' | null>(null)
  const sidebarWidth = signal(260)
  const inspectorWidth = signal(300)
  const sidebarVisible = signal(true)
  const inspectorVisible = signal(true)

  return <View class="flex-1 bg-background">
    <ResizablePanelGroup axis="horizontal" class="flex-1"
      handleClass="h-full w-px bg-border"
      handleThumbClass="h-5 w-[3px] rounded-full bg-muted-foreground opacity-0 group-hover:opacity-40"
      handleAccessibilityLabel="调整分栏">
      <ResizablePanel size={sidebarWidth()} minSize={180} maxSize={360} fixed visible={sidebarVisible()}
        onResize={size => sidebarWidth.set(size)}>
        <BotSidebar model={props.model} openSettings={props.openSettings}
          collapsed={() => !sidebarVisible()}
          setCollapsed={value => sidebarVisible.set(!value)} />
      </ResizablePanel>
      <ResizablePanel minSize={280}>
        <ConversationView model={props.model} openSettings={props.openSettings}
          openApproval={() => dialog.set('approval')}
          sidebarCollapsed={() => !sidebarVisible()}
          expandSidebar={() => sidebarVisible.set(true)} />
      </ResizablePanel>
      <ResizablePanel size={inspectorWidth()} minSize={240} maxSize={420} fixed visible={inspectorVisible()}
        onResize={size => inspectorWidth.set(size)}>
        <View class="flex-1 border-l border-border">
          <View class="flex-row justify-end border-b border-border px-2 py-1">
            <BaseButton testID="inspector-collapse" accessibilityLabel="折叠详情"
              onPress={() => inspectorVisible.set(false)}
              class="rounded-md px-2 py-1 hover:bg-muted active:opacity-70">
              <Text class="text-xs text-muted-foreground">⟩</Text>
            </BaseButton>
          </View>
          <BotInspector model={props.model} edit={() => dialog.set('bot')} />
        </View>
      </ResizablePanel>
    </ResizablePanelGroup>
    {!inspectorVisible() ? <View class="absolute right-3 top-3">
      <BaseButton testID="inspector-expand" accessibilityLabel="展开详情"
        onPress={() => inspectorVisible.set(true)}
        class="rounded-md border border-border bg-background px-2 py-1.5 shadow-sm hover:bg-muted active:opacity-70">
        <Text class="text-xs text-muted-foreground">详情 ⟨</Text>
      </BaseButton>
    </View> : null}
    {props.model.creating() ? <CreateBotDialog model={props.model} /> : null}
    {dialog() === 'bot' ? <BotSettingsDialog model={props.model} close={() => dialog.set(null)} /> : null}
    {dialog() === 'approval' && props.model.pendingApproval() ? <ApprovalDialog model={props.model} close={() => dialog.set(null)} /> : null}
  </View>
}
