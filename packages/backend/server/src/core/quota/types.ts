import { Field, ObjectType } from '@nestjs/graphql';
import { SafeIntResolver } from 'graphql-scalars';
import { z } from 'zod';

import { commonFeatureSchema, FeatureKind } from '../features/types';
import { ByteUnit, OneDay, OneKB } from './constant';

/// ======== quota define ========

/**
 * naming rule:
 * we append Vx to the end of the feature name to indicate the version of the feature
 * x is a number, start from 1, this number will be change only at the time we change the schema of config
 * for example, we change the value of `blobLimit` from 10MB to 100MB, then we will only change `version` field from 1 to 2
 * but if we remove the `blobLimit` field or rename it, then we will change the Vx to Vx+1
 */
export enum QuotaType {
  FreePlanV1 = 'free_plan_v1',
  ProPlanV1 = 'pro_plan_v1',
  TeamPlanV1 = 'team_plan_v1',
  LifetimeProPlanV1 = 'lifetime_pro_plan_v1',
  // only for test, smaller quota
  RestrictedPlanV1 = 'restricted_plan_v1',
}

const basicQuota = z.object({
  name: z.string(),
  blobLimit: z.number().positive().int(),
  storageQuota: z.number().positive().int(),
  seatQuota: z.number().positive().int().nullish(),
  historyPeriod: z.number().positive().int(),
  memberLimit: z.number().positive().int(),
  businessBlobLimit: z.number().positive().int().nullish(),
});

const userQuota = basicQuota.extend({
  copilotActionLimit: z.number().positive().int().nullish(),
});

const userQuotaPlan = z.object({
  feature: z.enum([
    QuotaType.FreePlanV1,
    QuotaType.ProPlanV1,
    QuotaType.LifetimeProPlanV1,
    QuotaType.RestrictedPlanV1,
  ]),
  configs: userQuota,
});

const workspaceQuotaPlan = z.object({
  feature: z.enum([QuotaType.TeamPlanV1]),
  configs: basicQuota,
});

/// ======== schema infer ========

export const QuotaSchema = commonFeatureSchema
  .extend({
    type: z.literal(FeatureKind.Quota),
  })
  .and(z.discriminatedUnion('feature', [userQuotaPlan, workspaceQuotaPlan]));

export type Quota<Q extends QuotaType = QuotaType> = z.infer<
  typeof QuotaSchema
> & { feature: Q };
export type QuotaConfigType = Quota['configs'];

/// ======== query types ========

@ObjectType()
export class HumanReadableQuotaType {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  blobLimit!: string;

  @Field(() => String)
  storageQuota!: string;

  @Field(() => String)
  historyPeriod!: string;

  @Field(() => String)
  memberLimit!: string;

  @Field(() => String, { nullable: true })
  copilotActionLimit?: string;
}

@ObjectType()
export class QuotaQueryType {
  @Field(() => String)
  name!: string;

  @Field(() => SafeIntResolver)
  blobLimit!: number;

  @Field(() => SafeIntResolver)
  historyPeriod!: number;

  @Field(() => SafeIntResolver)
  memberLimit!: number;

  @Field(() => SafeIntResolver)
  memberCount!: number;

  @Field(() => SafeIntResolver)
  storageQuota!: number;

  @Field(() => SafeIntResolver, { nullable: true })
  copilotActionLimit?: number;

  @Field(() => HumanReadableQuotaType)
  humanReadable!: HumanReadableQuotaType;

  @Field(() => SafeIntResolver)
  usedSize!: number;
}

/// ======== utils ========

export function formatSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';

  const dm = decimals < 0 ? 0 : decimals;

  const i = Math.floor(Math.log(bytes) / Math.log(OneKB));

  return (
    parseFloat((bytes / Math.pow(OneKB, i)).toFixed(dm)) + ' ' + ByteUnit[i]
  );
}

export function formatDate(ms: number): string {
  return `${(ms / OneDay).toFixed(0)} days`;
}

export type QuotaBusinessType = QuotaQueryType & {
  businessBlobLimit: number;
  unlimited: boolean;
};
