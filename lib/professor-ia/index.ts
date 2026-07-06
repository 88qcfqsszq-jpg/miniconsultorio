// ============================================================================
// Professor IA — barrel de re-exports (conveniência).
// Módulo preparado, ainda NÃO utilizado. Sem IA, sem endpoint, sem chat.
// ============================================================================

export * from "./types";
export * from "./interfaces";
export { buildProfessorContext, resumirHealthBench } from "./context-builder";
export { buildKnowledgeMap, inferirTemaClinico } from "./knowledge-builder";
export { buildStudyPlan } from "./study-plan-builder";
export { buildConversationModel, preverPromptCompleto } from "./conversation-builder";
export { buildTeachingStrategy } from "./teaching-engine";
export type {
  TeachingMode,
  TeachingStrategy,
  TeachingPriority,
  TeachingObjective,
  TeachingIntervention,
  TeachingDecision,
  TeachingRoadmap,
  TeachingSession,
  TeachingInput,
} from "./teaching-engine";
export { buildProfessorPersona, PERSONAS } from "./persona-engine";
export type {
  ProfessorPersona,
  ProfessorPersonaKey,
  ProfessorTone,
  ProfessorStrictness,
  ProfessorPacing,
  ProfessorInteractionStyle,
  TeachingSessionConfig,
  ProfessorPersonaDecision,
  PersonaInput,
} from "./persona-engine";
export { buildLessonPlan } from "./lesson-planner";
export type {
  TeachingActionType,
  TeachingAction,
  LessonPhase,
  LessonStep as PlannerLessonStep,
  LessonPlan,
  LessonPlannerInput,
  LessonPlannerOutput,
} from "./lesson-planner";
export { buildProfessorIAPreview } from "./preview-builder";
export type { ProfessorIAPreviewInput } from "./preview-builder";
export { buildLessonStepsFromProfessorLesson, buildLessonFlowFromProfessorLesson, LESSON_STEP_SCHEMA_VERSION } from "./lesson-step-engine";
export type {
  LessonStep,
  LessonStepType,
  LessonStepStatus,
  LessonStepInstruction,
  LessonStepResource,
  LessonStepExpectedStudentAction,
  LessonStepTransition,
  LessonStepFeedbackRule,
  LessonStepExecutionPlan,
  LessonFlow,
  LessonFlowRule,
  LessonFlowBranch,
  LessonFlowBranchCondition,
  LessonFlowCheckpoint,
} from "./lesson-step-engine";
export { buildProfessorLesson, PROFESSOR_LESSON_SCHEMA_VERSION } from "./professor-lesson";
export { buildProfessorOpenChatContext } from "./open-chat-context";
export type { BuildOpenChatContextInput, OpenChatContext, OpenChatFeedbackLike } from "./open-chat-context";
export { generateProfessorStepResponse, buildStepPrompt, resolveCurrentStep, staticFallbackResponse } from "./orchestrator";
export type { OrchestratorInput, OrchestratorResult, OrchestratorHistoryItem, CallModel } from "./orchestrator";
export {
  buildStudentTrace,
  summarizeStudentTrace,
  validateTraceAgainstGoldStandard,
  validateProfessorMessageAgainstTrace,
  NEUTRAL_OPENING,
  STUDENT_TRACE_SCHEMA_VERSION,
} from "./student-trace";
export type {
  StudentTrace,
  StudentTraceEvent,
  StudentTraceEventType,
  StudentTraceEvidence,
  StudentTraceSummary,
  StudentTraceStrength,
  StudentTraceWeakness,
  StudentTraceOmission,
  StudentTraceCriticalMismatch,
  StudentTraceValidationResult,
  StudentTraceInput,
  EvidenceStrength,
  GuardrailResult,
} from "./student-trace";
export type {
  ProfessorLesson,
  ProfessorLessonStatus,
  ProfessorLessonHeader,
  ProfessorLessonDiagnosis,
  ProfessorLessonObjective,
  ProfessorLessonAction,
  ProfessorLessonResource,
  ProfessorLessonPromptPlan,
  ProfessorLessonOpeningLine,
  ProfessorLessonMiniQuiz,
  ProfessorLessonExpectedAnswer,
  ProfessorLessonSafetyRule,
  ProfessorLessonNextStep,
  BuildProfessorLessonInput,
} from "./professor-lesson";
export { buildLearningSession, summarizeLearningSession } from "./learning-session";
export type {
  LearningSession,
  LearningSessionGoal,
  LearningSessionMode,
  LearningSessionEnergy,
  LearningSessionEmotion,
  LearningSessionTimeBox,
  LearningSessionContext,
  LearningSessionConstraint,
  LearningSessionSignal,
  LearningSessionAdaptation,
  LearningSessionSummary,
  LearningSessionInput,
} from "./learning-session";
export { buildStudentModel, summarizeStudentModel } from "./student-model";
export type {
  StudentModel,
  StudentProfile,
  StudentLevel,
  StudentCompetencySnapshot,
  StudentLongitudinalPerformance,
  StudentRecurringError,
  StudentCaseAttemptSummary,
  StudentSystemWeakness,
  StudentExamWeakness,
  StudentLearningPreference,
  StudentProgressTrend,
  StudentReviewNeed,
  StudentRiskPattern,
  StudentModelSummary,
  StudentModelInput,
  StudentAttemptInput,
} from "./student-model";
