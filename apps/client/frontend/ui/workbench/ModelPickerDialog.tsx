import { View, Text } from 'nsh'
import { Button } from '../shared/Button'
import type { Workbench } from '../../application/conversation/controller'
import { DialogFrame } from '../shared/DialogFrame'
export function ModelPickerDialog(props: { model: Workbench; close(): void }) {
  const { models, modelKey, select, changeModel } = props.model
  return <DialogFrame title="选择模型" close={props.close}><View class="gap-3">
    <Text class="text-xs text-muted-foreground">当前对话从下一执行步骤生效；已经准备的步骤保留原模型。</Text>
    {models().map(model => <Button id={`select-model-${model.provider}-${model.model}`} label={`${model.name}（${model.providerName}）`} onPress={() => { void changeModel(modelKey(model)).then(props.close) }} />)}
  </View></DialogFrame>
}
