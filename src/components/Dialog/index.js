import { withInstall } from '@/landao/utils';
import basicDialog from './src/BasicDialog';
export const LdDialog = withInstall(basicDialog);
export { useDialog, useDialogInner } from './src/useDialog';