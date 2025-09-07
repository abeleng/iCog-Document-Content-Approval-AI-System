export const notifications = [
  {
    id: "notif_1",
    userId: "u_marketing",
    type: "task_scored",
    title: "Newsletter Review Complete", 
    message: "Your January newsletter has been scored 85/100 by Miriam Reviewer",
    taskId: "marketing-newsletter-2025-01",
    createdAt: "2025-01-19T11:30:00Z",
    read: false
  },
  {
    id: "notif_2",
    userId: "u_reviewer1", 
    type: "task_assigned",
    title: "New Task Assignment",
    message: "You have been assigned to review: January 2025 Marketing Newsletter",
    taskId: "marketing-newsletter-2025-01", 
    createdAt: "2025-01-18T16:00:00Z",
    read: true
  },
  {
    id: "notif_3",
    userId: "u_marketing",
    type: "task_approved",
    title: "Brand Guidelines Approved",
    message: "Your brand guidelines have been approved and are now complete",
    taskId: "marketing-brand-guide-2025",
    createdAt: "2025-01-13T14:20:00Z", 
    read: true
  },
  {
    id: "notif_4",
    userId: "u_admin",
    type: "anomaly_detected", 
    title: "Review Anomaly Detected",
    message: "Reviewer gave 100% score in 90 seconds - flagged for review",
    taskId: null,
    createdAt: "2025-01-19T09:15:00Z",
    read: false
  }
];