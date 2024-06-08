
import type MongoDB from 'mongodb';

//------------------------------------------------------------//
//                        Helper Types                        //
//------------------------------------------------------------//

export type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

//------------------------------------------------------------//
//                      Database Schemas                      //
//------------------------------------------------------------//

export interface DbProductData {
    _id: MongoDB.ObjectId;
    purchasable: boolean;
    downloadable: boolean;
    code: string;
    name: string;
    description: string;
    price_in_usd: string;
    price_in_lumens: number;

    sorting_priority: number;
    tags: string[];
}

//------------------------------------------------------------//

export interface DbUserProducts {
    [product_code: string]: boolean;
}

export interface DbUserData {
    _id: MongoDB.ObjectId;
    identity: DbUserIdentity;
    lumens: number;
}

//------------------------------------------------------------//

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DbBlacklistedUserIdentity extends DbUserIdentity {}

export interface DbBlacklistedUserRecord {
    _id: MongoDB.ObjectId;
    identity: DbBlacklistedUserIdentity;
    reason: string;
    epoch: number;
    staff_member_id: string;
}

//------------------------------------------------------------//

export interface DbPendingVerificationData {
    _id: MongoDB.ObjectId;
    identity: Partial<DbUserIdentity>;
    creation_epoch: number;
    code: string;
}

//------------------------------------------------------------//

export interface DbModerationActionUserIdentity extends Pick<DbUserIdentity, 'discord_user_id'> {}

export type DbModerationActionType = 'WARN' | 'TIMEOUT' | 'MUTE' | 'KICK' | 'BAN';

export interface DbModerationActionRecord {
    id: string, // a UUIDv4 string
    type: DbModerationActionType;
    epoch: number;
    reason: string;
    staff_member_id: string;
}

export interface DbModerationAction {
    identity: DbModerationActionUserIdentity;
    record: DbModerationActionRecord;
}