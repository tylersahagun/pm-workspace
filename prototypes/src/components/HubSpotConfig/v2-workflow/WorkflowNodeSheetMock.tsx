import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { X, PencilIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * WorkflowNodeSheetMock - Replicates the WorkflowNodeSheet from the main codebase
 * This shows how the HubSpot config would appear when integrated into the workflow builder.
 *
 * Reference: web/src/components/workflows/workflow-node-sheet.tsx
 */

export interface WorkflowNodeData {
  title: string;
  operationId: string;
  operationName: string;
  config: Record<string, unknown>;
  isNew?: boolean;
  hasChanges?: boolean;
}

interface WorkflowNodeSheetMockProps {
  data: WorkflowNodeData;
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  onSave?: (config: Record<string, unknown>) => void;
  isSaving?: boolean;
  width?: number;
  primaryColor?: string;
  backgroundColor?: string;
  outputProperties?: { key: string; description: string }[];
}

// Integration icons mapping (simplified for prototype)
const IntegrationIcon: React.FC<{ operationId: string; className?: string }> = ({
  operationId,
  className,
}) => {
  const getIconEmoji = () => {
    if (operationId.includes('hubspot')) return '🔶';
    if (operationId.includes('salesforce')) return '☁️';
    if (operationId.includes('slack')) return '💬';
    return '⚡';
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded bg-orange-100 text-2xl',
        className
      )}
    >
      {getIconEmoji()}
    </div>
  );
};

export const WorkflowNodeSheetMock: React.FC<WorkflowNodeSheetMockProps> = ({
  data,
  children,
  open,
  onClose,
  onSave,
  isSaving = false,
  width = 450,
  primaryColor = '#ff7a59', // HubSpot orange
  backgroundColor = '#fff5f0',
  outputProperties = [],
}) => {
  const [activeTab, setActiveTab] = useState<'configuration' | 'outputs'>('configuration');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(data.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    // In real implementation, this would update the workflow node
  };

  if (!open) return null;

  return (
    <div
      className="bg-white rounded-lg shadow-xl border flex flex-col h-[calc(100vh-48px)] overflow-hidden"
      style={{
        width: `${width}px`,
        borderColor: primaryColor,
      }}
    >
      {/* Header */}
      <div
        className="p-4 border-b flex justify-between items-start"
        style={{ backgroundColor }}
      >
        <div className="flex flex-col gap-1 flex-1">
          {/* Icon */}
          <div className="flex justify-start">
            <IntegrationIcon
              operationId={data.operationId}
              className="size-10 shrink-0"
            />
          </div>

          {/* Title with edit */}
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <Input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                autoFocus
                className="text-xl font-semibold bg-transparent w-auto"
                placeholder={data.operationName}
              />
            ) : (
              <span className="text-xl font-semibold leading-tight">
                {title || data.operationName}
              </span>
            )}
            <Button
              onClick={() => setIsEditingTitle(true)}
              variant="ghost"
              size="icon"
              className="h-6 w-6"
            >
              <PencilIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Status badges */}
          <div className="flex gap-2 mt-1">
            {data.isNew && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                New
              </Badge>
            )}
            {data.hasChanges && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                Modified
              </Badge>
            )}
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-auto">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'configuration' | 'outputs')}
          className="h-full flex flex-col"
        >
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
            <TabsTrigger
              value="configuration"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Configuration
            </TabsTrigger>
            <TabsTrigger
              value="outputs"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Outputs
            </TabsTrigger>
          </TabsList>

          <Separator className="mb-4" />

          <TabsContent
            value="configuration"
            className="flex-1 overflow-auto p-4 mt-0"
            forceMount
          >
            {children}
          </TabsContent>

          <TabsContent value="outputs" className="flex-1 overflow-auto p-4 mt-0" forceMount>
            {outputProperties.length > 0 ? (
              <div className="flex flex-col gap-4">
                {outputProperties.map(({ key, description }) => (
                  <div key={key} className="flex flex-col gap-2">
                    <Badge className="self-start">{key}</Badge>
                    <span className="text-sm text-muted-foreground">{description}</span>
                    <Separator />
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                Node outputs will be available after configuration.
              </span>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Save Footer */}
      {onSave && (
        <div className="border-t p-4 bg-muted/30">
          <Button
            onClick={() => onSave(data.config)}
            disabled={isSaving}
            className="w-full"
            style={{ backgroundColor: primaryColor }}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Configuration'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkflowNodeSheetMock;

