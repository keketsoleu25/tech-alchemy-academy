import type { Prisma } from "@/generated/prisma/client";

export async function writeAuditEvent({
  tx,
  actorId,
  action,
  entityType,
  entityId,
  summary,
  metadata,
}: {
  tx: Prisma.TransactionClient;
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: Prisma.InputJsonValue;
}) {
  return tx.auditEvent.create({
    data: {
      actorId,
      action,
      entityType,
      entityId: entityId ?? null,
      summary,
      metadata,
    },
  });
}
