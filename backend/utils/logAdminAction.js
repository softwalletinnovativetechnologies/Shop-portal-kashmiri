import AuditLog from "../models/AuditLog.js";

export const logAdminAction = async ({ adminId, action, target, ip }) => {
  try {
    await AuditLog.create({
      admin: adminId,
      action,
      target,
      ipAddress: ip,
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
};
