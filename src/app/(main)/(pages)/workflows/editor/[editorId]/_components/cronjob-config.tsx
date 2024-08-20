import CronjobForm from '@/components/forms/cronjob-form';
import { CronjobConfig } from '@/lib/types';
import { useState } from 'react';
import { useEditor } from '@/providers/editor-provider';
import { onSaveCronjob } from '../../../_actions/workflow-connections';

const CronjobConfigCard = () => {
  const [cronjob, setCronjob] = useState<CronjobConfig>({} as CronjobConfig);
  const { state } = useEditor();
  const workflowId = state.editor.selectedNode.id;
  const onUpdate = async (cronjobConfig: CronjobConfig) => {
    onSaveCronjob(workflowId, cronjobConfig);
  };

  return <CronjobForm cronjobConfig={cronjob} onUpdate={onUpdate} />;
};

export default CronjobConfigCard;
