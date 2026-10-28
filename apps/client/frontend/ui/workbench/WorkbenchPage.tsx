import { View, signal } from 'nsh'
import type { Workbench } from '../../application/conversation/controller'
import { BotSidebar } from './BotSidebar'
import { ConversationView } from './ConversationView'
import { BotInspector } from './BotInspector'
import { CreateBotDialog } from './CreateBotDialog'
import { BotSettingsDialog } from './BotSettingsDialog'
import { ModelPickerDialog } from './ModelPickerDialog'
import { ApprovalDialog } from './ApprovalDialog'

export function WorkbenchPage(props: { model: Workbench; openSettings(): void }) {
  const dialog = signal<'bot' | 'model' | 'approval' | null>(null)
  return <View class="flex-1 flex-row bg-background">
    <BotSidebar model={props.model} openSettings={props.openSettings} />
    <ConversationView model={props.model} openSettings={props.openSettings} openApproval={() => dialog.set('approval')} />
    <BotInspector model={props.model} edit={() => dialog.set('bot')} chooseModel={() => dialog.set('model')} />
    {props.model.creating() ? <CreateBotDialog model={props.model} /> : null}
    {dialog() === 'bot' ? <BotSettingsDialog model={props.model} close={() => dialog.set(null)} /> : null}
    {dialog() === 'model' ? <ModelPickerDialog model={props.model} close={() => dialog.set(null)} /> : null}
    {dialog() === 'approval' && props.model.pendingApproval() ? <ApprovalDialog model={props.model} close={() => dialog.set(null)} /> : null}
  </View>
}
