export const auditTrail = [
  {
    id: "audit_1",
    taskId: "marketing-newsletter-2025-01",
    action: "task_created",
    actor: "u_marketing",
    actorName: "Selam Marketing",
    timestamp: "2025-01-15T10:00:00Z",
    details: "Task created with high priority"
  },
  {
    id: "audit_2", 
    taskId: "marketing-newsletter-2025-01",
    action: "draft_submitted",
    actor: "u_marketing",
    actorName: "Selam Marketing", 
    timestamp: "2025-01-18T14:30:00Z",
    details: "PDF draft uploaded (2MB)"
  },
  {
    id: "audit_3",
    taskId: "marketing-newsletter-2025-01", 
    action: "ai_precheck_completed",
    actor: "system",
    actorName: "AI System",
    timestamp: "2025-01-18T15:00:00Z",
    details: "Pre-check completed with 76% baseline score"
  },
  {
    id: "audit_4",
    taskId: "marketing-newsletter-2025-01",
    action: "reviewer_assigned", 
    actor: "u_admin",
    actorName: "Abe Admin",
    timestamp: "2025-01-18T16:00:00Z",
    details: "Assigned to Miriam Reviewer"
  },
  {
    id: "audit_5",
    taskId: "marketing-newsletter-2025-01",
    action: "reviewer_scored",
    actor: "u_reviewer1", 
    actorName: "Miriam Reviewer",
    timestamp: "2025-01-19T11:30:00Z",
    details: "Scored 85/100, review time: 45 minutes",
    reviewTime: 45
  },
  {
    id: "audit_6",
    taskId: "marketing-brand-guide-2025",
    action: "task_created",
    actor: "u_marketing",
    actorName: "Selam Marketing",
    timestamp: "2025-01-10T11:00:00Z", 
    details: "Task created with low priority"
  },
  {
    id: "audit_7",
    taskId: "marketing-brand-guide-2025",
    action: "draft_submitted",
    actor: "u_marketing",
    actorName: "Selam Marketing",
    timestamp: "2025-01-12T16:20:00Z",
    details: "PDF draft uploaded (5MB)"
  },
  {
    id: "audit_8", 
    taskId: "marketing-brand-guide-2025",
    action: "reviewer_scored",
    actor: "u_reviewer1",
    actorName: "Miriam Reviewer",
    timestamp: "2025-01-13T14:15:00Z", 
    details: "Scored 100/100, review time: 30 minutes",
    reviewTime: 30
  },
  {
    id: "audit_9",
    taskId: "marketing-brand-guide-2025",
    action: "task_approved",
    actor: "u_reviewer1",
    actorName: "Miriam Reviewer", 
    timestamp: "2025-01-13T14:20:00Z",
    details: "Task approved and completed"
  }
];