import { useMutation } from '@tanstack/react-query';
import { ViewportPortal } from '@xyflow/react';
import React from 'react';

import { useSocket } from '@/components/socket-provider';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { INTERNAL_ERROR_TOAST, toast } from '@/components/ui/use-toast';
import { flowsApi } from '@/features/flows/lib/flows-api';
import { TriggerType, isNil } from '@activepieces/shared';

import { useBuilderStateContext } from '../builder-hooks';

const TestFlowWidget = React.memo(() => {
  const [flowVersion, setRun] = useBuilderStateContext((state) => [
    state.flowVersion,
    state.setRun,
  ]);

  const triggerHasSampleData =
    flowVersion.trigger.type === TriggerType.PIECE &&
    !isNil(flowVersion.trigger.settings.inputUiInfo?.currentSelectedData);

  const socket = useSocket();
  const { mutate, isPending } = useMutation<void>({
    mutationFn: () =>
      flowsApi.testFlow(
        socket,
        {
          flowVersionId: flowVersion.id,
        },
        (run) => {
          setRun(run, flowVersion);
        },
      ),
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
      toast(INTERNAL_ERROR_TOAST);
    },
  });

  return (
    <ViewportPortal>
      <div
        style={{
          transform: 'translate(0px, -50px)',
          position: 'absolute',
          pointerEvents: 'auto',
        }}
      >
        <div className="justify-center items-center flex w-[260px]">
          {flowVersion.valid && triggerHasSampleData && (
            <Button
              key={'test-flow-button'}
              variant="outline"
              className="h-8 bg-primary-100/50 text-primary-300 hover:bg-primary-100/80 hover:text-primary-300"
              loading={isPending}
              onClick={() => mutate()}
            >
              Test Flow
            </Button>
          )}
          {flowVersion.valid && !triggerHasSampleData && (
            <Tooltip>
              <TooltipTrigger asChild className="disabled:pointer-events-auto">
                <Button
                  variant="ghost"
                  className="h-8 bg-primary-100/80 text-primary-300 hover:bg-primary-100/80 hover:text-primary-300"
                  disabled={true}
                >
                  Test Flow
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Please test the trigger first
              </TooltipContent>
            </Tooltip>
          )}
          {!flowVersion.valid && (
            <Button
              variant="ghost"
              className="h-8 bg-warning-100/50 text-warning-300 hover:bg-warning-100/80 hover:text-warning-300"
              key={'complete-flow-button'}
            >
              Complete Settings
            </Button>
          )}
        </div>
      </div>
    </ViewportPortal>
  );
});

TestFlowWidget.displayName = 'TestFlowWidget';
export { TestFlowWidget };
