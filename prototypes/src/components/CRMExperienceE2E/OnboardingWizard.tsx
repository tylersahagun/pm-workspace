import * as React from 'react';
import {
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Loader2,
  Sparkles,
  AlertTriangle,
  Play,
  Zap,
  Eye,
  Shield,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  OnboardingStep,
  OnboardingState,
  CallType,
  WorkflowTemplate,
  TestPreviewResult,
  FieldPreview,
} from './types';
import {
  MOCK_WORKFLOW_TEMPLATES,
  MOCK_TEST_PREVIEW,
} from './types';

// HubSpot logo component
const HubSpotLogo = () => (
  <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
    <path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.984v-.066A2.198 2.198 0 0017.235.838h-.066a2.198 2.198 0 00-2.196 2.196v.066c0 .907.55 1.685 1.334 2.022v2.81a5.166 5.166 0 00-2.49 1.227l-6.554-5.1a2.628 2.628 0 00.087-.653 2.626 2.626 0 00-2.626-2.626 2.626 2.626 0 00-2.626 2.626 2.626 2.626 0 002.626 2.626c.48 0 .926-.133 1.312-.358l6.442 5.014a5.18 5.18 0 00-.603 2.428 5.2 5.2 0 00.647 2.513l-1.98 1.98a1.69 1.69 0 00-.493-.077 1.706 1.706 0 00-1.706 1.706 1.706 1.706 0 001.706 1.706 1.706 1.706 0 001.706-1.706c0-.175-.028-.343-.077-.502l1.953-1.953a5.21 5.21 0 003.548 1.398 5.226 5.226 0 005.226-5.226 5.21 5.21 0 00-3.227-4.834zm-1.03 7.093a2.26 2.26 0 01-2.26-2.26 2.26 2.26 0 012.26-2.26 2.26 2.26 0 012.26 2.26 2.26 2.26 0 01-2.26 2.26z"/>
  </svg>
);

interface OnboardingWizardProps {
  initialState?: Partial<OnboardingState>;
  onComplete?: (state: OnboardingState) => void;
}

const STEPS: { id: OnboardingStep; label: string }[] = [
  { id: 'connect', label: 'Connect' },
  { id: 'education', label: 'Learn' },
  { id: 'scope', label: 'Scope' },
  { id: 'templates', label: 'Templates' },
  { id: 'test', label: 'Test' },
  { id: 'activate', label: 'Activate' },
];

const CALL_TYPES: { id: CallType; label: string; description: string }[] = [
  { id: 'discovery', label: 'Discovery Calls', description: 'Initial qualification and needs assessment' },
  { id: 'demo', label: 'Product Demos', description: 'Showcasing product capabilities' },
  { id: 'negotiation', label: 'Negotiation', description: 'Pricing and contract discussions' },
  { id: 'onboarding', label: 'Onboarding', description: 'Customer implementation calls' },
  { id: 'check_in', label: 'Check-ins', description: 'Regular customer touchpoints' },
  { id: 'renewal', label: 'Renewals', description: 'Contract renewal discussions' },
];

export function OnboardingWizard({ initialState, onComplete }: OnboardingWizardProps) {
  const [state, setState] = React.useState<OnboardingState>({
    currentStep: 'connect',
    crmConnected: false,
    crmType: null,
    workspaceId: null,
    selectedCallType: null,
    enabledTemplates: [],
    testResult: null,
    isActivated: false,
    ...initialState,
  });

  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isTesting, setIsTesting] = React.useState(false);
  const [isActivating, setIsActivating] = React.useState(false);

  const currentStepIndex = STEPS.findIndex(s => s.id === state.currentStep);

  const goToStep = (step: OnboardingStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      goToStep(STEPS[nextIndex].id);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    setState(prev => ({
      ...prev,
      crmConnected: true,
      crmType: 'hubspot',
      workspaceId: 'workspace-123',
    }));
    setIsConnecting(false);
    nextStep();
  };

  const handleSelectCallType = (callType: CallType) => {
    setState(prev => ({ ...prev, selectedCallType: callType }));
    // Auto-enable recommended templates for this call type
    const recommended = MOCK_WORKFLOW_TEMPLATES
      .filter(t => t.callTypes.includes(callType) && t.isRecommended)
      .map(t => t.id);
    setState(prev => ({ ...prev, enabledTemplates: recommended }));
  };

  const handleToggleTemplate = (templateId: string) => {
    setState(prev => ({
      ...prev,
      enabledTemplates: prev.enabledTemplates.includes(templateId)
        ? prev.enabledTemplates.filter(id => id !== templateId)
        : [...prev.enabledTemplates, templateId],
    }));
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    // Simulate test run
    await new Promise(resolve => setTimeout(resolve, 2000));
    setState(prev => ({ ...prev, testResult: MOCK_TEST_PREVIEW }));
    setIsTesting(false);
  };

  const handleActivate = async () => {
    setIsActivating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setState(prev => ({ ...prev, isActivated: true, currentStep: 'complete' as OnboardingStep }));
    setIsActivating(false);
    onComplete?.(state);
  };

  const availableTemplates = state.selectedCallType
    ? MOCK_WORKFLOW_TEMPLATES.filter(t => t.callTypes.includes(state.selectedCallType!))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Progress Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Sparkles className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">CRM Agent Setup</h1>
                <p className="text-sm text-slate-400">Configure your HubSpot automation</p>
              </div>
            </div>
            {state.crmConnected && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="size-2 rounded-full bg-emerald-500" />
                <span className="text-sm text-emerald-400">HubSpot Connected</span>
              </div>
            )}
          </div>

          {/* Step Progress */}
          <div className="flex items-center gap-2">
            {STEPS.map((step, index) => {
              const isComplete = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => isComplete && goToStep(step.id)}
                    disabled={!isComplete}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all',
                      isComplete && 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer',
                      isCurrent && 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
                      !isComplete && !isCurrent && 'text-slate-500'
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="size-4" />
                    ) : (
                      <span className={cn(
                        'size-5 rounded-full flex items-center justify-center text-xs font-medium',
                        isCurrent ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400'
                      )}>
                        {index + 1}
                      </span>
                    )}
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <ChevronRight className={cn(
                      'size-4',
                      index < currentStepIndex ? 'text-emerald-500' : 'text-slate-700'
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Connect Step */}
        {state.currentStep === 'connect' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="size-20 mx-auto rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 flex items-center justify-center">
                <HubSpotLogo />
              </div>
              <h2 className="text-3xl font-bold text-white">Connect Your CRM</h2>
              <p className="text-lg text-slate-400 max-w-md mx-auto">
                Link your HubSpot account to enable AI-powered CRM updates after every call.
              </p>
            </div>

            <div className="max-w-sm mx-auto">
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className={cn(
                  'w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl',
                  'bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium',
                  'hover:from-orange-600 hover:to-orange-700 transition-all',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <HubSpotLogo />
                    Connect HubSpot
                  </>
                )}
              </button>
            </div>

            {/* Security & Trust Banner for Skeptics */}
            <div className="max-w-md mx-auto p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="size-4 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">Enterprise Security</span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300">SOC 2 Certified</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Your data is encrypted, never used for training, and you can rollback any change instantly.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Shield className="size-4" />
                <span>OAuth 2.0 Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="size-4" />
                <span>Read & Write Access</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="size-4" />
                <span>Rollback Anytime</span>
              </div>
            </div>
          </div>
        )}

        {/* Education Step */}
        {state.currentStep === 'education' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">How CRM Agents Work</h2>
              <p className="text-lg text-slate-400 max-w-lg mx-auto">
                AskElephant analyzes your calls and automatically updates HubSpot—so you can focus on selling.
              </p>
            </div>

            {/* Visual Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Play className="size-6" />,
                  title: '1. Your Call Ends',
                  description: 'After every meeting, AskElephant analyzes the conversation for key information.',
                  color: 'from-blue-500 to-blue-600',
                },
                {
                  icon: <Sparkles className="size-6" />,
                  title: '2. AI Extracts Insights',
                  description: 'We identify deal stage changes, next steps, risks, and other CRM-relevant data.',
                  color: 'from-purple-500 to-purple-600',
                },
                {
                  icon: <Zap className="size-6" />,
                  title: '3. HubSpot Updates',
                  description: 'Your CRM is updated automatically—or you can review first if you prefer.',
                  color: 'from-orange-500 to-orange-600',
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="relative p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-4"
                >
                  <div className={cn(
                    'size-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white',
                    step.color
                  )}>
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.description}</p>
                </div>
              ))}
            </div>

            {/* Example Output */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-4">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Example Output</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Deal Stage', before: 'Meeting Scheduled', after: 'Proposal', confidence: 92 },
                  { label: 'Next Step', before: 'Schedule demo', after: 'Send proposal by Friday', confidence: 88 },
                ].map((field, index) => (
                  <div key={index} className="p-4 rounded-xl bg-slate-900/50 space-y-2">
                    <div className="text-sm font-medium text-white">{field.label}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500 line-through">{field.before}</span>
                      <ArrowRight className="size-3 text-slate-600" />
                      <span className="text-emerald-400">{field.after}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 flex-1 rounded-full bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${field.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{field.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={nextStep}
                className={cn(
                  'flex items-center gap-2 px-8 py-3 rounded-xl',
                  'bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium',
                  'hover:from-orange-600 hover:to-orange-700 transition-all'
                )}
              >
                I Understand, Let's Continue
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        )}

        {/* Scope Step */}
        {state.currentStep === 'scope' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">What Calls Should We Handle?</h2>
              <p className="text-lg text-slate-400 max-w-lg mx-auto">
                Start with one call type. You can add more later once you see it working.
              </p>
            </div>
            
            {/* Start Small Banner for Skeptics */}
            <div className="max-w-lg mx-auto p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="size-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Start Small, See Results Fast</h4>
                  <p className="text-xs text-slate-400">
                    Pick your most common call type. We recommend starting with just one workflow—you can 
                    expand once you've built confidence. Most teams see value within their first 5 calls.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CALL_TYPES.map((callType) => (
                <button
                  key={callType.id}
                  onClick={() => handleSelectCallType(callType.id)}
                  className={cn(
                    'p-4 rounded-xl border text-left transition-all',
                    state.selectedCallType === callType.id
                      ? 'bg-orange-500/10 border-orange-500/50 ring-2 ring-orange-500/20'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                  )}
                >
                  <div className="font-medium text-white mb-1">{callType.label}</div>
                  <div className="text-sm text-slate-400">{callType.description}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={nextStep}
                disabled={!state.selectedCallType}
                className={cn(
                  'flex items-center gap-2 px-8 py-3 rounded-xl',
                  'bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium',
                  'hover:from-orange-600 hover:to-orange-700 transition-all',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                Continue
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        )}

        {/* Templates Step */}
        {state.currentStep === 'templates' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Pre-built Workflows</h2>
              <p className="text-lg text-slate-400 max-w-lg mx-auto">
                These are proven workflows for {CALL_TYPES.find(c => c.id === state.selectedCallType)?.label.toLowerCase()}.
                Start with the recommended ones.
              </p>
            </div>

            <div className="space-y-4">
              {availableTemplates.map((template) => {
                const isEnabled = state.enabledTemplates.includes(template.id);
                return (
                  <div
                    key={template.id}
                    className={cn(
                      'p-5 rounded-xl border transition-all',
                      isEnabled
                        ? 'bg-orange-500/10 border-orange-500/50'
                        : 'bg-slate-800/50 border-slate-700/50'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white">{template.name}</h3>
                          {template.isRecommended && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mb-3">{template.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {template.fields.map((field) => (
                            <span
                              key={field}
                              className="px-2 py-1 rounded-md text-xs bg-slate-700/50 text-slate-300"
                            >
                              {field.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleTemplate(template.id)}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                          isEnabled
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        )}
                      >
                        {isEnabled ? 'Enabled' : 'Enable'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center">
              <button
                onClick={nextStep}
                disabled={state.enabledTemplates.length === 0}
                className={cn(
                  'flex items-center gap-2 px-8 py-3 rounded-xl',
                  'bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium',
                  'hover:from-orange-600 hover:to-orange-700 transition-all',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                Test on Real Data
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        )}

        {/* Test Step */}
        {state.currentStep === 'test' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Test Before You Activate</h2>
              <p className="text-lg text-slate-400 max-w-lg mx-auto">
                See exactly what would happen with a real meeting. Build confidence before going live.
              </p>
            </div>

            {!state.testResult ? (
              <div className="max-w-md mx-auto space-y-6">
                <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-4">
                  <h3 className="font-medium text-white">Select a Recent Meeting</h3>
                  <select className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white">
                    <option>Discovery Call - Acme Corp (Today, 2:30 PM)</option>
                    <option>Demo - TechStart Inc (Yesterday, 10:00 AM)</option>
                    <option>Intro Call - GlobalTech (Jan 14, 3:00 PM)</option>
                  </select>
                </div>

                <button
                  onClick={handleRunTest}
                  disabled={isTesting}
                  className={cn(
                    'w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl',
                    'bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium',
                    'hover:from-orange-600 hover:to-orange-700 transition-all',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Analyzing Meeting...
                    </>
                  ) : (
                    <>
                      <Play className="size-5" />
                      Run Preview
                    </>
                  )}
                </button>
              </div>
            ) : (
              <TestPreviewResults
                result={state.testResult}
                onRetry={() => setState(prev => ({ ...prev, testResult: null }))}
                onContinue={nextStep}
              />
            )}
          </div>
        )}

        {/* Activate Step */}
        {state.currentStep === 'activate' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="size-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="size-10 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold text-white">Ready to Activate!</h2>
              <p className="text-lg text-slate-400 max-w-lg mx-auto">
                Your CRM agent is configured and tested. Activate it to start updating HubSpot automatically.
              </p>
            </div>

            {/* Summary */}
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-4">
              <h3 className="font-medium text-white">Configuration Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">CRM</span>
                  <span className="text-white">HubSpot</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Call Type</span>
                  <span className="text-white">{CALL_TYPES.find(c => c.id === state.selectedCallType)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Workflows Enabled</span>
                  <span className="text-white">{state.enabledTemplates.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Test Result</span>
                  <span className="text-emerald-400">Passed ✓</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleActivate}
                disabled={isActivating}
                className={cn(
                  'flex items-center gap-3 px-8 py-4 rounded-xl',
                  'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium text-lg',
                  'hover:from-emerald-600 hover:to-emerald-700 transition-all',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isActivating ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Activating...
                  </>
                ) : (
                  <>
                    <Zap className="size-5" />
                    Activate Agent
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {state.currentStep === 'complete' as OnboardingStep && (
          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <div className="size-24 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="size-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">You're All Set! 🎉</h2>
              <p className="text-lg text-slate-400 max-w-lg mx-auto">
                Your CRM agent is now active. After your next {CALL_TYPES.find(c => c.id === state.selectedCallType)?.label.toLowerCase()}, 
                HubSpot will be updated automatically.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-xl',
                  'bg-slate-800 text-white font-medium',
                  'hover:bg-slate-700 transition-all'
                )}
              >
                <Eye className="size-5" />
                View Activity Dashboard
              </button>
              <button
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-xl',
                  'bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium',
                  'hover:from-orange-600 hover:to-orange-700 transition-all'
                )}
              >
                Configure More Agents
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Test Preview Results Component
function TestPreviewResults({
  result,
  onRetry,
  onContinue,
}: {
  result: TestPreviewResult;
  onRetry: () => void;
  onContinue: () => void;
}) {
  const isHighConfidence = result.overallConfidence >= 0.8;
  const isMediumConfidence = result.overallConfidence >= 0.6 && result.overallConfidence < 0.8;

  return (
    <div className="space-y-6">
      {/* Match Result */}
      <div className={cn(
        'p-6 rounded-2xl border',
        isHighConfidence
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : isMediumConfidence
            ? 'bg-amber-500/10 border-amber-500/30'
            : 'bg-red-500/10 border-red-500/30'
      )}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {isHighConfidence ? (
              <CheckCircle2 className="size-6 text-emerald-500" />
            ) : isMediumConfidence ? (
              <AlertTriangle className="size-6 text-amber-500" />
            ) : (
              <AlertTriangle className="size-6 text-red-500" />
            )}
            <div>
              <h3 className="font-medium text-white">
                {result.matchedRecord ? `Matched: ${result.matchedRecord.name}` : 'No Match Found'}
              </h3>
              <p className="text-sm text-slate-400">
                {isHighConfidence
                  ? 'High confidence match. Ready to update.'
                  : isMediumConfidence
                    ? 'Medium confidence. You may want to review.'
                    : 'Low confidence. Review recommended.'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{Math.round(result.overallConfidence * 100)}%</div>
            <div className="text-xs text-slate-400">confidence</div>
          </div>
        </div>
        {result.matchedRecord && (
          <a
            href={result.matchedRecord.hubspotUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-sm text-orange-400 hover:text-orange-300"
          >
            View in HubSpot
            <ExternalLink className="size-3" />
          </a>
        )}
      </div>

      {/* Fields Preview */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Fields to Update</h3>
        <div className="grid gap-3">
          {result.fieldsToUpdate.map((field, index) => (
            <FieldPreviewCard key={index} field={field} />
          ))}
        </div>
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <AlertTriangle className="size-4" />
            <span className="font-medium">Warnings</span>
          </div>
          <ul className="text-sm text-slate-300 space-y-1">
            {result.warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onRetry}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl',
            'bg-slate-800 text-white font-medium',
            'hover:bg-slate-700 transition-all'
          )}
        >
          <RefreshCw className="size-4" />
          Try Another Meeting
        </button>
        <button
          onClick={onContinue}
          className={cn(
            'flex items-center gap-2 px-8 py-3 rounded-xl',
            'bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium',
            'hover:from-orange-600 hover:to-orange-700 transition-all'
          )}
        >
          Looks Good, Continue
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}

function FieldPreviewCard({ field }: { field: FieldPreview }) {
  const isHighConfidence = field.confidence >= 0.8;
  const isMediumConfidence = field.confidence >= 0.6 && field.confidence < 0.8;

  return (
    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="font-medium text-white">{field.fieldLabel}</div>
          <div className="flex items-center gap-2 text-sm mt-1">
            {field.currentValue && (
              <>
                <span className="text-slate-500 line-through">{field.currentValue}</span>
                <ArrowRight className="size-3 text-slate-600" />
              </>
            )}
            <span className="text-emerald-400">{field.newValue}</span>
          </div>
        </div>
        <div className={cn(
          'px-2 py-1 rounded-md text-xs font-medium',
          isHighConfidence
            ? 'bg-emerald-500/20 text-emerald-400'
            : isMediumConfidence
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-red-500/20 text-red-400'
        )}>
          {Math.round(field.confidence * 100)}%
        </div>
      </div>
      <div className="text-xs text-slate-500 italic">
        "{field.source}"
      </div>
    </div>
  );
}

export default OnboardingWizard;
